import Link from "next/link";
import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import MockLinkArt from "../../src/contracts/MockLink.json";
import NeverFightTwiceArt from "../../src/contracts/NeverFightTwice.json";
import NFTSimpleArt from "../../src/contracts/NFTSimple.json";
import VRFCoordinatorMockArt from "../../src/contracts/VRFCoordinatorMock.json";
import ZOPNFTFactoryIF from "../../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../../src/contracts/contract-address.json";



import {NoWalletDetected} from "../../src/components/NoWalletDetected";
import {Loading} from "../../src/components/Loading";
import {NetworkErrorMessage} from "../../src/components/NetworkErrorMessage";
import ERC721Art from "../../src/contracts/ERC721.json";


const HARDHAT_NETWORK_ID = '1337';
const NeverFightTwiceAddr = contractAddress.NeverFightTwice;
const NFTSimpleAddr = contractAddress.NFTSimple;
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;
const options = {method: 'GET', cache: "no-store"};



// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class WalletShow extends React.Component {
    constructor(props) {
        super(props);

        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's an useful example.
        this.initialState = {
            // The info of the token (i.e. It's Name and symbol)
            tokenData: undefined,
            // The user's address and balance
            selectedAddress: undefined,
            balance: undefined,
            // The ID about transactions being sent, and any possible error with them
            txBeingSent: undefined,
            transactionError: undefined,
            networkError: undefined,
            walletReady: false
        };

        this.state = this.initialState;
    }


    render(){
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        //if (window.ethereum === undefined) {
        const isSSR = typeof window === "undefined";
        //console.log(isSSR);
        if ( isSSR === true) {
            return <NoWalletDetected/>;
        }

        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
            if (!this.state.networkError) {
                return (
                            <div
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this._connectWallet()}
                            >
                                Connect Wallet
                            </div>

                );
            } else {
                return (
                    <div className="container">
                        <div className="row justify-content-md-center">
                            {/* Metamask network should be set to Localhost:8545. */}
                            {this.state.networkError && (
                                <NetworkErrorMessage
                                    message={this.state.networkError}
                                    dismiss={() => this._dismissNetworkError()}
                                />
                            )}
                        </div>
                    </div>
                )
            }
        };

        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        if (!this.state.tokenData || !this.state.balance || !this.state.tokenIds || !this.state.NFTs || !this.state.NFTs_NeverFightTwice) {
            console.log("tokenData:" + this.state.tokenData);
            console.log("balance:" + this.state.balance);
            console.log("NFTs:" + this.state.NFTs);
            console.log("NFTs_NeverFightTwice:" + this.state.NFTs_NeverFightTwice);
            return <Loading />;
        }


        const wallet_addr = this.state.selectedAddress.substring(0, 6) + ".." + this.state.selectedAddress.substring(38);
        return (
            <div className="btn btn-primary">{wallet_addr}</div>

        );
    }

    async _connectWallet() {

        if ( window.ethereum === undefined ) {
            //console.log("!!!");
            return this._resetState();
        }
        //console.log("!!!");
        const [selectedAddress] = await window.ethereum.enable();

        // First we check the network is Rinkeby
        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);

        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();

            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });

        window.ethereum.on("networkChanged", ([networkId]) => {
            this._stopPollingData();
            this._resetState();
        });
    }

    async _initialize(userAddress) {

        this.setState({
            selectedAddress: userAddress,
            requestIdUsed: []
        });

        this._intializeEthers();
        this._getTokenData();
        this._startPollingData();

        fetch("https://api.imgflip.com/get_memes")
            .then(response => response.json())
            .then(response => {
                const { memes } = response.data
                this.setState({ allMemeImgs: memes, _popup: false })
                // console.log(memes)
            })

    }
    async _intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);
        // this.web3 = new Web3(this._provider);

        //TODO:
        this.link = new ethers.Contract(contractAddress.MockLink,MockLinkArt.abi,this._provider.getSigner(0));
        this.neverFightTwice = new ethers.Contract(contractAddress.NeverFightTwice,NeverFightTwiceArt.abi,this._provider.getSigner(0));
        this.nftSimple = new ethers.Contract(contractAddress.NFTSimple,NFTSimpleArt.abi,this._provider.getSigner(0));
        this.vrfCoordinatorMock = new ethers.Contract(contractAddress.VRFCoordinatorMock,VRFCoordinatorMockArt.abi,this._provider.getSigner(0));
        this.zopnftFactory = new ethers.Contract(contractAddress.ZOPNFTFactory,ZOPNFTFactoryIF.abi,this._provider.getSigner(0));

    }
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }
    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID || window.ethereum.networkVersion === '4') {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Rinkeby or Localhost:8545'
        });

        return false;
    }
    // See your NFTSimple info
    // The next two methods just read from the contract and store the results
    // in the component state.
    async _getTokenData() {
        const name = await this.nftSimple.name();
        const symbol = await this.nftSimple.symbol();
        //const symbol = "options list";
        //TODO: get options token.
        this.setState({ tokenData: { name, symbol } })

    }
    _startPollingData() {
        this._pollDataInterval = setInterval(() => {
            this._updateBalance()
            //TODO: check options token.
            //this.checkWinLose()
        }, 8000); // check every 8 seconds

        // We run it once immediately so we don't have to wait for it
        this._updateBalance();
    }


    addressEqual(a, b) {
        return a.toLowerCase() === b.toLowerCase();
    }

    async listTokensOfOwner({ token: tokenAddress, account }) {
        const token = new ethers.Contract(tokenAddress, ERC721Art.abi, this._provider.getSigner(0));

        const sentLogs = await token.queryFilter(
            token.filters.Transfer(account, null),
        );
        const receivedLogs = await token.queryFilter(
            token.filters.Transfer(null, account),
        );

        const logs = sentLogs.concat(receivedLogs)
            .sort(
                (a, b) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.TransactionIndex,
            );

        const owned = new Set();

        for (const log of logs) {
            const { from, to, tokenId } = log.args;

            if (this.addressEqual(to, account)) {
                owned.add(tokenId.toString());
            } else if (this.addressEqual(from, account)) {
                owned.delete(tokenId.toString());
            }
        }

        // console.log([...owned].join('\n'));
        return owned
    }
    async _updateBalance() {
        //TODO: list tokens
        const balance = await this.nftSimple.balanceOf(this.state.selectedAddress);
        let tokenIds = await this.listTokensOfOwner({
            token: this.nftSimple.address,
            account: this.state.selectedAddress
        })

        this._updateNFTs().then(NFTs => this.setState({ NFTs: NFTs}))
        this._updateNeverFightTwiceNFTs().then(NFTs_NeverFightTwice => this.setState({NFTs_NeverFightTwice: NFTs_NeverFightTwice}));

        // console.log(NFTs.length, commits.assets.length)
        this.setState({ balance: balance, tokenIds: tokenIds});
        console.log('updated balance')
    }

    async _updateNFTs(){
        const signer = this._provider.getSigner(0);
        const selectedAddress = this.state.selectedAddress;
        // const neverFightTwiceAddr = this.neverFightTwice.address
        // get all NFTs
        // let response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${this.state.selectedAddress}&order_direction=desc&offset=0&limit=20`, options);
        let response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${this.state.selectedAddress}&order_direction=desc&offset=0&limit=20`, options);
        let commits = await response.json();

        let len = commits.assets? commits.assets.length: 0
        let NFTs = []

        for (let i=0;i<len;i++ ){
            let item = commits.assets[i]
            const token = new ethers.Contract(item.asset_contract.address, ERC721Art.abi, signer);
            let owner = await token.ownerOf(item.token_id)
            if(owner.toLowerCase() === selectedAddress){
                NFTs.push({
                    name: item.name,
                    nftContractName: item.asset_contract.name,
                    nftContractAddr: item.asset_contract.address,
                    thumbnail: item.image_thumbnail_url,
                    openseaLink: item.permalink,
                    tokenId: item.token_id
                })
            }

        }
        if(this.state.NFTs){
            this.state.NFTs.filter(async function (nft) {
                if(nft.openseaLink==='' && nft.nftContractName==='NFTSimple'){
                    // let owner = await token.ownerOf(nft.tokenId)
                    // console.log(owner,selectedAddress )
                    // const token = new ethers.Contract(nft.nftContractAddr, ERC721Art.abi, signer);
                    // if(owner.toLowerCase() == selectedAddress){
                    const found = NFTs.some(e => e.tokenId===nft.tokenId);
                    if (!found) NFTs.unshift(nft)

                    // }
                }
                // if(nft.nftContractAddr === this.state.toRemoveNFT && nft.tokenId === this.state.toRemoveId){
                //   NFTs = this.removeA(NFTs, nft)
                // }
            })

        }
        console.log('updated NFTs')
        return NFTs
    }

    async _updateNeverFightTwiceNFTs(){

        ////////////
        let response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${this.neverFightTwice.address}&order_direction=desc&offset=0&limit=20`, options);
        let commits = await response.json();
        let len = commits.assets? commits.assets.length: 0
        let NFTs_NeverFightTwice = []
        for (let i=0;i<len;i++ ){
            let item = commits.assets[i]
            // const token = new ethers.Contract(item.asset_contract.address, ERC721Art.abi, signer);
            // let owner = await token.ownerOf(item.token_id)
            // if(owner.toLowerCase() == neverFightTwiceAddr){
            NFTs_NeverFightTwice.push({
                name: item.name,
                nftContractName: item.asset_contract.name,
                nftContractAddr: item.asset_contract.address,
                thumbnail: item.image_thumbnail_url,
                openseaLink: item.permalink,
                tokenId: item.token_id
            })
            // }
        }

        console.log('updated NeverFightTwice NFTs')
        return NFTs_NeverFightTwice;
    }

}



export default WalletShow;
