# Kentico Kontent Bynder

Sample custom element that uses the [Bynder Compact View UI Component](https://developer-docs.bynder.com/ui-components#compact-view) to list Bynder assets in a Bynder account.

![KontentBynder](https://user-images.githubusercontent.com/34716163/96636319-21e1e900-12eb-11eb-9962-50d1f18f82e0.gif)

## Setup

1. Deploy the custom element code in `Client/` to a secure public host.
   - See the [Deploying](#Deploying) section for a really quick option.
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
   - The `Hosted code URL` is where you deployed to in step 2.
   - The `Parameters {JSON}` is a JSON object containing element parameters. See the [JSON parameters](#json-parameters) section for details.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yuriys-kentico/KenticoKontentBynder)

## JSON Parameters

`bynderOptions` is an `object` defining the [Bynder options (properties under "How it works")](https://developer-docs.bynder.com/ui-components#compact-view).

Example JSON parameters object:

```json
{
  "bynderOptions": {
    "defaultDomain": "https://sample-account.getbynder.com/"
  }
}
```
