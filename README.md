# Customer Support Chatbot Widget

## Development

- `npm install`
- `npm run dev`
- `npm run build`

## Embedding the Widget

Drop a single script tag into the host page. The widget will create its own container and mount automatically:

```html
<script src="https://cdn.example.com/chat-bot-widget.js" data-client-key="YOUR_CLIENT_KEY"></script>
```

Replace the `src` with the path where you host the bundled asset produced in `dist/chat-bot-widget.iife.js`, and set `data-client-key` to the key issued for the tenant.

### Optional attributes

- `data-custom-user-id` – override the generated user identifier.
- `data-api-url` – point the widget at a different API base.
- `data-target` – CSS selector of an existing element to mount into (no DOM removal on destroy).
- `data-container-id` – id assigned to the auto-created container (defaults to `chat-bot-widget`).
- `data-auto-mount="false"` – ship the script without mounting so you can control it manually.

### Manual control (optional)

When you need imperative control, call the exposed global:

```html
<script>
  const container = document.createElement('div');
  document.body.appendChild(container);
  const instance = window.ChatBotWidget.mount(container, {
    clientKey: 'YOUR_CLIENT_KEY',
    customUserId: 'user-123',
    apiUrl: 'https://api.example.com',
    removeContainerOnDestroy: false,
  });
  // instance.destroy();
</script>
```

You can destroy all auto-mounted instances using `window.ChatBotWidget.destroy()`.