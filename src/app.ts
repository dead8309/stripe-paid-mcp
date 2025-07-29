// From: https://github.com/cloudflare/ai/blob/main/demos/remote-mcp-server/src/app.ts

import { Hono } from "hono";
import {
	layout,
	homeContent,
	parseApproveFormBody,
	renderAuthorizationApprovedContent,
	renderLoggedInAuthorizeScreen,
	renderLoggedOutAuthorizeScreen,
	renderPaymentSuccessContent,
} from "./utils";
import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";

export type Bindings = Env & {
	OAUTH_PROVIDER: OAuthHelpers;
};

const app = new Hono<{
	Bindings: Bindings;
}>();

app.get("/", async (c) => {
	const content = await homeContent(c.req.raw);
	return c.html(layout(content, "MCP Marketplace"));
});

// Render an authorization page
// If the user is logged in, we'll show a form to approve the appropriate scopes
// If the user is not logged in, we'll show a form to both login and approve the scopes
app.get("/authorize", async (c) => {
	// We don't have an actual auth system, so to demonstrate both paths, you can
	// hard-code whether the user is logged in or not. We'll default to true
	// const isLoggedIn = false;
	const isLoggedIn = true;

	const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);

	const oauthScopes = [
		{
			name: "read_profile",
			description: "Read your basic profile information",
		},
		{ name: "read_data", description: "Access your stored data" },
		{ name: "write_data", description: "Create and modify your data" },
	];

	if (isLoggedIn) {
		const content = await renderLoggedInAuthorizeScreen(
			oauthScopes,
			oauthReqInfo,
		);
		return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
	}

	const content = await renderLoggedOutAuthorizeScreen(
		oauthScopes,
		oauthReqInfo,
	);
	return c.html(layout(content, "MCP Remote Auth Demo - Authorization"));
});

app.get("/payment/success", async (c) => {
	return c.html(
		layout(
			await renderPaymentSuccessContent(),
			"Payment Success",
			"payment.sh",
		),
	);
});

// The /authorize page has a form that will POST to /approve
// This endpoint is responsible for validating any login information and
// then completing the authorization request with the OAUTH_PROVIDER
app.post("/approve", async (c) => {
	const { action, oauthReqInfo, email } = await parseApproveFormBody(
		await c.req.parseBody(),
	);

	if (!oauthReqInfo) {
		return c.html("INVALID LOGIN", 401);
	}

	const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
		request: oauthReqInfo,
		userId: email,
		metadata: {
			label: "Test User",
		},
		scope: oauthReqInfo.scope,
		props: {
			userEmail: email,
		},
	});

	c.env.OAUTH_STRIPE_MCP_KV.put(email, redirectTo);
	return c.html(
		layout(
			await renderAuthorizationApprovedContent(redirectTo),
			"Authorization Status",
		),
	);
});

export default app;
