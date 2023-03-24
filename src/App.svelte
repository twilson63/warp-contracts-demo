<script>
  import { onMount } from "svelte";
  import { ArweaveWebWallet } from "arweave-wallet-connector";
  import { WarpFactory } from "warp-contracts";
  import {
    DeployPlugin,
    InjectedArweaveSigner,
    // @ts-ignore
  } from "warp-contracts-plugin-deploy";

  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const wallet = new ArweaveWebWallet({ name: "Test App" });
  wallet.setUrl("arweave.app");

  // onMount(() => {
  //   arweave = window.Arweave.init({});
  //   warp = window.warp.WarpFactory.forMainnet().use(new DeployPlugin());
  // });

  async function deployContract() {
    const src = await fetch("/contract-src.js").then((res) => res.text());

    let userSigner = null;
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
      userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    } else {
      await wallet.connect();
      userSigner = new InjectedArweaveSigner(wallet.namespaces.arweaveWallet);
    }
    const address = await window.arweaveWallet.getActiveAddress();
    const initState = JSON.stringify({ balances: { [address]: 1 * 1e12 } });

    await userSigner.setPublicKey();
    try {
      const { contractTxId } = await warp.deploy({
        wallet: userSigner,
        initState,
        src,
      });
      console.log({ contractTxId });
    } catch (e) {
      console.log(e);
    }
  }
</script>

<div class="hero min-h-screen">
  <div class="hero-content flex-col">
    <h1 class="mb-16 text-2xl">Deploy Contract Example</h1>

    <button class="btn" on:click={deployContract}>Deploy</button>
  </div>
</div>
