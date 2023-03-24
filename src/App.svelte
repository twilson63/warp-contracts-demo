<script>
  import { onMount } from "svelte";
  import { ArweaveWebWallet } from "arweave-wallet-connector";
  import { WarpFactory } from "warp-contracts";
  import {
    DeployPlugin,
    InjectedArweaveSigner,
    // @ts-ignore
  } from "warp-contracts-plugin-deploy";

  let name, ticker, created;
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
    const initState = JSON.stringify({
      balances: { [address]: 1 * 1e12 },
      name,
      ticker: ticker.toUpperCase(),
    });

    await userSigner.setPublicKey();
    try {
      const { contractTxId } = await warp.deploy({
        wallet: userSigner,
        initState,
        src,
      });
      created = contractTxId;
      console.log({ contractTxId });
    } catch (e) {
      console.log(e);
    }
  }
</script>

<div class="hero min-h-screen">
  <div class="hero-content flex-col">
    {#if !created}
      <h1 class="mb-16 text-2xl">Create "Permaweb SmartWeave Token" PST</h1>

      <input
        class="input input-bordered"
        type="text"
        bind:value={name}
        placeholder="name"
        required
      />
      <input
        class="input input-bordered"
        type="text"
        bind:value={ticker}
        placeholder="ticker symbol"
        required
      />

      <button class="btn" on:click={deployContract}>Deploy</button>
    {:else}
      <h1 class="text-4xl">Created {name} ({ticker}) Token!</h1>
      <div>{created}</div>
    {/if}
  </div>
</div>
