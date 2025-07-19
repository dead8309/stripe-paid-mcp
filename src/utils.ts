import {html, raw} from 'hono/html';
import type {HtmlEscapedString} from 'hono/utils/html';
import type {AuthRequest} from '@cloudflare/workers-oauth-provider';

export const layout = (
  content: HtmlEscapedString | string,
  title: string,
  terminal_title?: string
) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                dark: {
                  50: '#18181b',
                  100: '#27272a',
                  200: '#3f3f46',
                  300: '#52525b',
                  400: '#71717a',
                  500: '#a1a1aa',
                  600: '#d4d4d8',
                  700: '#e4e4e7',
                  800: '#f4f4f5',
                  900: '#fafafa',
                },
              },
              fontFamily: {
                mono: [
                  'JetBrains Mono',
                  'Fira Code',
                  'Monaco',
                  'Consolas',
                  'monospace',
                ],
              },
              animation: {
                glow: 'glow 2s ease-in-out infinite alternate',
                'slide-in': 'slideIn 0.5s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
              },
              keyframes: {
                glow: {
                  '0%': {
                    boxShadow:
                      '0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff',
                  },
                  '100%': {
                    boxShadow:
                      '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
                  },
                },
                slideIn: {
                  '0%': {opacity: '0', transform: 'translateX(-20px)'},
                  '100%': {opacity: '1', transform: 'translateX(0)'},
                },
                fadeIn: {
                  '0%': {opacity: '0', transform: 'translateY(10px)'},
                  '100%': {opacity: '1', transform: 'translateY(0)'},
                },
              },
            },
          },
        };
      </script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
        * {
          border-radius: 0 !important;
        }
        body {
          font-family: 'JetBrains Mono', monospace;
          background: #000000;
        }
        .grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }
        .card {
          background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
          border: 1px solid #3f3f46;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s ease;
        }
        .card:hover::before {
          left: 100%;
        }
        .card:hover {
          border-color: #ffffff;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .terminal-window {
          background: #000000;
          border: 2px solid #3f3f46;
          position: relative;
        }
        .terminal-header {
          background: #18181b;
          border-bottom: 1px solid #3f3f46;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #ffffff;
          margin-right: 8px;
          animation: glow 2s ease-in-out infinite alternate;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #18181b;
        }
        ::-webkit-scrollbar-thumb {
          background: #3f3f46;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      </style>
    </head>
    <body
      class="bg-black text-gray-300 font-mono leading-relaxed flex flex-col min-h-screen grid-pattern"
    >
      <!-- Header -->
      <header class="bg-black border-b-2 border-dark-200 sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div class="status-indicator"></div>
              <a
                href="/"
                class="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-300"
                data-text="MCP_MARKETPLACE"
              >
                MCP_MARKETPLACE
              </a>
            </div>
          </div>
        </div>
      </header>
      <!-- Main Content -->
      <main class="container mx-auto px-6 py-12 flex-grow">
        <div class="max-w-6xl mx-auto">
          <!-- Terminal Window -->
          <div class="terminal-window mb-8 animate-slide-in">
            <div class="terminal-header">
              <div class="terminal-dot !rounded-full bg-[#ef4444] size-3"></div>
              <div class="terminal-dot !rounded-full bg-[#f59e0b] size-3"></div>
              <div class="terminal-dot !rounded-full bg-[#10b981] size-3"></div>
              <span class="text-dark-500 text-sm font-mono ml-4"
                >${terminal_title ?? '~/mcp-marketplace'}</span
              >
            </div>
            <div class="p-8">
              <!-- Main Content Card -->
              <div class="lg:col-span-2 card p-8 animate-fade-in">
                ${content}
              </div>
            </div>
          </div>
        </div>
      </main>
      <!-- Footer -->
      <footer class="bg-black border-t-2 border-dark-200 py-12 mt-16">
        <div class="container mx-auto px-6">
          <!-- Copyright -->
          <div class="border-t border-dark-200 pt-8 text-center">
            <p class="text-dark-500 text-sm font-mono">
              [COPYRIGHT] &copy; ${new Date().getFullYear()} MCP_MARKETPLACE.
              ALL_RIGHTS_RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </body>
  </html>
`;

export const homeContent = async (req: Request): Promise<HtmlEscapedString> => {
  return html` <div class="max-w-4xl mx-auto markdown">Hi</div> `;
};

export const renderLoggedInAuthorizeScreen = async (
  oauthScopes: {name: string; description: string}[],
  oauthReqInfo: AuthRequest
) => {
  return html`
    <div class="border-b border-dark-200 pb-4 mb-6">
      <h1
        class="text-xl font-mono font-bold text-white uppercase tracking-wider"
      >
        [AUTHORIZATION_REQUEST]
      </h1>
    </div>
    <!-- Scopes -->
    <div class="mb-8">
      <h2
        class="text-sm font-mono font-semibold mb-4 text-white uppercase tracking-wide"
      >
        > MCP_MARKETPLACE REQUESTS_PERMISSION:
      </h2>
      <ul class="space-y-3">
        ${oauthScopes.map(
          (scope) => html`
            <li class="flex items-start bg-dark-50 border border-dark-200 p-3">
              <span class="inline-block mr-3 mt-0.5 text-white font-mono"
                >[✓]</span
              >
              <div class="flex-1 flex-col">
                <p class="font-mono font-medium text-white text-sm uppercase">
                  ${scope.name}
                </p>
                <p class="text-dark-500 text-xs font-mono leading-relaxed">
                  ${scope.description}
                </p>
              </div>
            </li>
          `
        )}
      </ul>
    </div>
    <!-- Form Section -->
    <form action="/approve" method="POST" class="space-y-4">
      <input
        type="hidden"
        name="oauthReqInfo"
        value="${JSON.stringify(oauthReqInfo)}"
      />
      <!-- Email Input -->
      <div class="space-y-2">
        <label
          class="block text-xs font-mono text-dark-500 uppercase tracking-wide"
        >
          > EMAIL_ADDRESS:
        </label>
        <input
          name="email"
          required
          placeholder="user@domain.com"
          class="w-full px-4 py-3 bg-black border-2 border-dark-200 text-white font-mono text-sm focus:outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 placeholder-dark-400"
        />
      </div>
      <!-- Action Buttons -->
      <div class="space-y-3 pt-4">
        <button
          type="submit"
          name="action"
          value="approve"
          class="w-full py-3 px-4 bg-white text-black font-mono font-bold text-sm uppercase tracking-wide border-2 border-dark-200 hover:border-green-600 transform hover:translate-y-[-1px]"
        >
          APPROVE
        </button>
        <button
          type="submit"
          name="action"
          value="reject"
          class="w-full py-3 px-4 bg-dark-50 border border-dark-200 text-white font-mono font-bold text-sm uppercase tracking-wide hover:border-2 hover:border-red-400 transform hover:translate-y-[-1px]"
        >
          REJECT
        </button>
      </div>
    </form>
    <style>
      /* Additional styles for the login section */
      .card input:focus {
        box-shadow:
          0 0 0 1px #ffffff,
          0 0 10px rgba(255, 255, 255, 0.3);
      }
      .card button:active {
        transform: translateY(0);
      }
      .card button:hover {
        position: relative;
      }
      .card button:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        animation: scan 0.5s ease-in-out;
      }
      @keyframes scan {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
      /* Terminal cursor effect for input focus */
      .card input:focus::after {
        content: '|';
        color: #ffffff;
        animation: blink 1s infinite;
      }
      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }
    </style>
  `;
};

export const renderLoggedOutAuthorizeScreen = async (
  oauthScopes: {name: string; description: string}[],
  oauthReqInfo: AuthRequest
) => {
  return html`
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-heading font-bold mb-6 text-gray-900">
        Authorization Request
      </h1>

      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-3 text-gray-800">
          MCP Marketplace would like permission to:
        </h2>
        <ul class="space-y-2">
          ${oauthScopes.map(
            (scope) => html`
              <li class="flex items-start">
                <span class="inline-block mr-2 mt-1 text-secondary">✓</span>
                <div>
                  <p class="font-medium">${scope.name}</p>
                  <p class="text-gray-600 text-sm">${scope.description}</p>
                </div>
              </li>
            `
          )}
        </ul>
      </div>
      <form action="/approve" method="POST" class="space-y-4">
        <input
          type="hidden"
          name="oauthReqInfo"
          value="${JSON.stringify(oauthReqInfo)}"
        />
        <div class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              type="email"
              id="email"
              name="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Password</label
            >
            <input
              type="password"
              id="password"
              name="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          name="action"
          value="login_approve"
          class="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Log in and Approve
        </button>
        <button
          type="submit"
          name="action"
          value="reject"
          class="w-full py-3 px-4 border border-gray-600 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Reject
        </button>
      </form>
    </div>
  `;
};

export const renderApproveContent = async (
  message: string,
  status: string,
  redirectUrl?: string
) => {
  return html`
    <div class="max-w-md mx-auto text-center">
      <div class="mb-6">
        <div
          class="inline-flex items-center justify-center w-16 h-16 border-2 ${status ===
          'success'
            ? 'border-green-500 text-green-500'
            : 'border-red-500 text-red-500'} font-mono text-2xl font-bold"
        >
          ${status === 'success' ? '[✓]' : '[✗]'}
        </div>
      </div>

      <h1
        class="text-xl font-mono font-bold mb-6 text-white uppercase tracking-wider"
      >
        ${message}
      </h1>

      <!-- Status Info -->
      <div class="mb-8 space-y-2">
        <p class="text-dark-500 text-sm font-mono uppercase tracking-wide">
          > REDIRECTING_TO_APPLICATION...
        </p>
        <div class="flex items-center justify-center space-x-1">
          <div class="w-1 h-1 bg-white animate-pulse"></div>
          <div
            class="w-1 h-1 bg-white animate-pulse"
            style="animation-delay: 0.2s"
          ></div>
          <div
            class="w-1 h-1 bg-white animate-pulse"
            style="animation-delay: 0.4s"
          ></div>
        </div>
      </div>
    </div>

    ${redirectUrl
      ? raw(`<script>
            setTimeout(() => {
        window.location.href = "${redirectUrl}"
        }, 2000);
    </script>`)
      : ''}

    <style>
      /* Pulsing animation for loading dots */
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.3;
        }
      }

      .animate-pulse {
        animation: pulse 1.5s ease-in-out infinite;
      }

      /* Status icon glow effect */
      .border-green-500 {
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
      }

      .border-red-500 {
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
      }
    </style>
  `;
};

export const renderAuthorizationApprovedContent = async (
  redirectUrl?: string
) => {
  return renderApproveContent(
    'Authorization approved!',
    'success',
    redirectUrl
  );
};

export const renderAuthorizationRejectedContent = async (
  redirectUrl?: string
) => {
  return renderApproveContent('Authorization rejected.', 'error', redirectUrl);
};

export const parseApproveFormBody = async (body: {
  [x: string]: string | File;
}) => {
  const action = body.action as string;
  const email = body.email as string;
  const password = body.password as string;
  let oauthReqInfo: AuthRequest | null = null;
  try {
    oauthReqInfo = JSON.parse(body.oauthReqInfo as string) as AuthRequest;
  } catch (e) {
    oauthReqInfo = null;
  }

  return {action, oauthReqInfo, email, password};
};

export const renderPaymentSuccessContent =
  async (): Promise<HtmlEscapedString> => {
    return html`
      <div class="max-w-md mx-auto p-8 text-center">
        <!-- Success Icon -->
        <div class="mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 border-2 border-green-500 text-green-500 font-mono text-2xl font-bold"
          >
            [✓]
          </div>
        </div>

        <!-- Success Message -->
        <h1
          class="text-xl font-mono font-bold mb-6 text-white uppercase tracking-wider"
        >
          [PAYMENT_SUCCESSFUL]
        </h1>

        <!-- Instructions -->
        <div class="mb-8 space-y-3">
          <p class="text-dark-500 text-sm font-mono uppercase tracking-wide">
            > TRANSACTION_COMPLETED
          </p>
          <p class="text-dark-600 text-xs font-mono leading-relaxed">
            Return to mcp client and rerun tool
          </p>
        </div>

        <style>
          /* Success icon glow effect */
          .border-green-500 {
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
          }
        </style>
      </div>
    `;
  };
