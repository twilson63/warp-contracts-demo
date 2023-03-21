<script>
  import { onMount } from "svelte";
  import {
    DeployPlugin,
    InjectedArweaveSigner,
    // @ts-ignore
  } from "https://unpkg.com/warp-contracts-plugin-deploy@1.0.1/bundles/web.bundle.min.js";
  let arweave, warp;

  const contractSrc = `
export function handle(state, action) {
  if (action.input.function === 'setName') {
	  ContractAssert(action.input.value, 'Value is Required!')
	  state['name'] = action.input.value
    return { state }
	}
	new ContractError('function is not set')
}
	`;
  const initialState = { name: "foo" };

  // onMount(() => {
  //   arweave = window.Arweave.init({});
  //   warp = window.warp.WarpFactory.forMainnet().use(new DeployPlugin());
  // });

  async function deployContract() {
    // @ts-ignore
    warp = window.warp.WarpFactory.forMainnet().use(new DeployPlugin());

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

    // @ts-ignore
    const userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    await userSigner.setPublicKey();
    const { contractTxId } = await warp.deploy({
      wallet: userSigner,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    });
    console.log({ contractTxId });
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

<h1 class="mb-16 text-2xl">Deploy Contract Example</h1>

<button class="btn" on:click={deployContract}>Deploy</button>
