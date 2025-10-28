export default {
    async fetch(request, env, ctx) {
        const router = new Router();

        router.post("/products", handleBuyProduct);
        router.get("/sessions/(\\d+)", handleFetchSession);
        router.post("/webhook", handleWebhook);
        router.post("/x402/requirements", handleX402Requirements);
        router.post("/x402/payments", handleX402Payment);

        // UI routes
        router.get("/", async (request, env) => serveAsset(request, env, "/payment.html"));
        router.get("/x402", async (request, env) => serveAsset(request, env, "/x402.html"));
        router.get("/8004", async (request, env) => serveAsset(request, env, "/8004.html"));

        // Add OPTIONS handlers for all routes
        router.options("/products", handleOptions);
        router.options("/sessions/(\\d+)", handleOptions);
        router.options("/webhook", handleOptions);
        router.options("/x402/requirements", handleOptions);
        router.options("/x402/payments", handleOptions);

        let response = await router.route(request, env);

        // If no API route matched, try serving static assets
        if (response.status === 404 && request.method === "GET" && env.ASSETS) {
            const url = new URL(request.url);
            const assetUrl = new URL(request.url);
            assetUrl.pathname = url.pathname === "/" ? "/index.html" : url.pathname;
            const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));
            if (assetResponse && assetResponse.status !== 404) {
                return assetResponse;
            }
        }

        // Add CORS headers for API responses
        const corsResponse = new Response(response.body, response);
        corsResponse.headers.set("Access-Control-Allow-Origin", "*");
        corsResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        corsResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return corsResponse;
    },
};

class Router {
    constructor() {
        this.routes = [];
    }

    get(path, handler) {
        this.routes.push({ path: new RegExp(`^${path}$`), method: "GET", handler });
    }

    post(path, handler) {
        this.routes.push({ path: new RegExp(`^${path}$`), method: "POST", handler });
    }

    options(path, handler) {
        this.routes.push({ path: new RegExp(`^${path}$`), method: "OPTIONS", handler });
    }

    async route(request, env) {
        const url = new URL(request.url);
        if (request.method === "OPTIONS") {
            return handleOptions(request, env);
        }

        for (const route of this.routes) {
            const match = url.pathname.match(route.path);
            if (match && request.method === route.method) {
                const params = match.slice(1);
                try {
                    return await route.handler(request, env, params);
                } catch (err) {
                    return new Response(err.message, { status: 500 });
                }
            }
        }
        return new Response("Not found", { status: 404 });
    }
}

async function serveAsset(request, env, path) {
    if (!env.ASSETS) {
        return new Response("Assets binding missing", { status: 500 });
    }
    const url = new URL(request.url);
    const assetUrl = new URL(request.url);
    assetUrl.pathname = path;
    return env.ASSETS.fetch(new Request(assetUrl, request));
}

async function handleOptions(request, env) {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

const products = {
    1: 200, // $2
    2: 1000, // $10
};

async function handleBuyProduct(request, env) {
    const { product, email } = await request.json();
    const price = products[product];

    if (!price) {
        return new Response(JSON.stringify({ error: "no product" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = {
        customer: email,
        amount: price,
    };

    const url = `${env.SERVICE}/sessions?apikey=${env.APIKEY}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleFetchSession(request, env, params) {
    const [id] = params;
    const url = `${env.SERVICE}/sessions/${id}?apikey=${env.APIKEY}`;
    const res = await fetch(url);
    const json = await res.json();
    return new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleWebhook(request, env) {
    return new Response(JSON.stringify({ status: "success" }), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleX402Requirements(request, env) {
    const { product, email } = await request.json();
    const price = products[product];

    if (!price) {
        return new Response(JSON.stringify({ errorReason: "no product" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = {
        customer: email,
        amount: price,
    };

    const url = `${env.SERVICE}/x402/requirements?apikey=${env.APIKEY}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleX402Payment(request, env) {
    const data = await request.json();
    const url = `${env.SERVICE}/x402/payments?apikey=${env.APIKEY}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
    });
}


