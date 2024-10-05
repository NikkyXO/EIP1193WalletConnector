# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


most of us don't understand the concept of global state management in react application.

Learn how to implement global state management using react's context api with this article https://www.freecodecamp.org/news/react-context-api-explained-with-examples/

Then move your wallet connection states from the custom hook into the context.

Feel free to explore other learning resources if you need to.

To be submitted before class today.



1) Web3CX1: 
https://sepolia-blockscout.lisk.com/tx/0x7d94b2bce978b74624ab6e71cb7aae0f66ef013d4a5c60b34497d881421b52b2

2) StakeEther: https://sepolia-blockscout.lisk.com/address/0x770fc900997936150174DbeF70C2Ed5c63AD58af

3) StakeEther2: https://sepolia-blockscout.lisk.com/address/0x3DDEEF073Ca5A871c27D9dA42C16Df592236e6E5

4) Verifier: https://sepolia-blockscout.lisk.com/address/0x3DDEEF073Ca5A871c27D9dA42C16Df592236e6E5  0xf6BaD83b767aAC6ABE13FB73B6dA9e9bf16A93a0
0xC19AE2c09B0f99BeDdC2aDD664cbbFfB866C746A


5) Vote: https://sepolia-blockscout.lisk.com/address/0x05da816849a2D0d68BE844d6ea902d43e8c875EC  0x0C20E45A25D7D1BB64586bE21EAe645069999835 
0x3D64674d27F18Bb7E1766408A5C4D245660e1A5f


6)  Verifier2: 0xf6BaD83b767aAC6ABE13FB73B6dA9e9bf16A93a0
7) VotingFactory: 0x0dF92B6B72AaF0DA51607bF6CAbDBF7cb6457aB5  0x45Ec26D32748Cd6053ec0BCFa822d1b239E2776C  
8) Web3CX1 Token: 0x1E78d975362F9e4184c89CaeCfB8eb6Ef64527C8
9) SaveERC20: 0xFe3257CFd4fCd650C053FA13A3436e31F1371679  
10) L2StandardBridge: 0x4200000000000000000000000000000000000010

11) OnchainNFT: 0x0De634481186EEE25bf800A4B53801Fb8ca30Fc8,        0xfB7df149d3780faa8Cabd3144939CE1Cf7d68F12
12) MyMSGWallet: 0x631388e0F7C10E4e128b168209030E0e74844563
13) MultiSigWalletFactory: 0xfB7df149d3780faa8Cabd3144939CE1Cf7d68F12