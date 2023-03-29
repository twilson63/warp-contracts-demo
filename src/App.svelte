<script>
  import { onMount } from "svelte";
  import {
    DeployPlugin,
    InjectedArweaveSigner,
    // @ts-ignore
  } from "warp-contracts-plugin-deploy";

  import { WarpFactory } from "warp-contracts/web";
  import Arweave from "arweave";

  const arweave = Arweave.init({});

  async function writeAction() {
    // @ts-ignore
    warp = WarpFactory.forMainnet().use(new DeployPlugin());

    //console.log(window.arweaveWallet);
    // @ts-ignore
    if (window.arweaveWallet) {
      // @ts-ignore
      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "ACCESS_PUBLIC_KEY",
        "SIGNATURE",
      ]);
    }

    const result = await warp
      .contract("Q8VdatWDqhsXbg-l1lsyLO8pgsnRJlOT5na4tVfod5c")
      .connect("use_wallet")
      .writeInteraction(
        {
          function: "transfer",
          target: "0gf7KpDmLMfCq8oqVeQqqJChzRnx0ZOtWsvHfVYKACo",
          qty: 1 * 1e6,
        },
        { disableBundling: true, strict: true }
      );

    console.log(result);
  }
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@2.51.5/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
  <script src="https://cdn.tailwindcss.com"></script>
  <script
    src="https://unpkg.com/browse/arweave@1.13.3/bundles/web.bundle.min.js"
  ></script>
  <script
    src="https://unpkg.com/warp-contracts@1.3.0/bundles/web.iife.bundle.min.js"
  ></script>
</svelte:head>

<h1 class="mb-16 text-2xl">Write Action Example</h1>

<button class="btn" on:click={writeAction}>Write Action</button>
