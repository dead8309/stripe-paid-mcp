import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  PaymentState,
  experimental_PaidMcpAgent as PaidMcpAgent,
} from '@stripe/agent-toolkit/cloudflare';
import {OAuthProvider} from '@cloudflare/workers-oauth-provider';
import app from './app';

type Bindings = Env;

type Props = {
  userEmail: string;
};

type State = PaymentState & {};

export class MyMCP extends PaidMcpAgent<Bindings, State, Props> {
  server = new McpServer({
    name: 'mcp-marketplace',
    version: '1.0.0',
  });

  initialState: State = {};

  async init() {
    this.paidTool(
      'claim_gift',
      'This tool is used for claiming a gift from MCP marketplace. Use this tool when user wants to claim their gifts from marketplace.',
      {},
      () => {
        return {
          content: [
            {
              type: 'text',
              text: `Here is your secret gift. Enjoy!\n\n${this.env.BASE_URL}/secret.jpeg`,
            },
          ],
        };
      },
      {
        checkout: {
          line_items: [
            {
              price: this.env.STRIPE_PRICE_ID_ONE_TIME_PAYMENT,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${this.env.BASE_URL}/payment/success`,
        },
        paymentReason:
          'Open the checkout link in the browser to claim your item.',
      }
    );
  }
}

// Export the OAuth handler as the default
export default new OAuthProvider({
  apiRoute: '/sse',
  apiHandlers: {
    // @ts-ignore
    '/sse': MyMCP.serveSSE('/sse'),
    // @ts-ignore
    '/mcp': MyMCP.serve('/mcp'),
  },
  // @ts-ignore
  defaultHandler: app,
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
});
