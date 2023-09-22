
class WebhookClient: ...

{
    "webhookname": {
        "name": "webhookname", # this will act like a uniique id to the webhook
        "url": "https://joshuas-awesome-frontend/webhook/someendpoing",
        "method": "POST", # or GET
        "schema": {
            "url": "string",
            "originalurl": "string",
            # ... etc, use "number" for int or float, "json" for arrays or dicts
        }
    }
}

client = WebhookClient([
    {
        "name": "webhookname", # this will act like a uniique id to the webhook
        "url": "https://joshuas-awesome-frontend/webhook/someendpoing",
        "method": "POST", # or GET
        "schema": {
            "url": "string",
            "originalurl": "string",
            # ... etc, use "number" for int or float, "json" for arrays or dicts
        }
    },
    {
        # ...
    }
])

# Define below methods in your code

response = client.call("webhookname", {
    "url": "https://google.com",
    "originalurl": "https://google.com"
})
