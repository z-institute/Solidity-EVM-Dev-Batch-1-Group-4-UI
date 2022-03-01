import UpdateInfo from "../components/form/UpdateInfo";
import LayoutAdmin from "../components/layout/LayoutAdmin";
import PersonalInfo from "../components/form/PersonalInfo";
import UpdateAvatar from "../components/form/UpdateAvatar";
import SettingsMenu from "../components/layout/SettingsMenu";
import {ErrorMessage, Field} from "formik";
import React, {useState} from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import MockLinkArt from "../src/contracts/MockLink.json";
import NeverFightTwiceArt from "../src/contracts/NeverFightTwice.json";
import NFTSimpleArt from "../src/contracts/NFTSimple.json";
import VRFCoordinatorMockArt from "../src/contracts/VRFCoordinatorMock.json";
import ZOPNFTFactoryIF from "../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../src/contracts/contract-address.json";



import {NoWalletDetected} from "../src/components/NoWalletDetected";
import {Loading} from "../src/components/Loading";
import {NetworkErrorMessage} from "../src/components/NetworkErrorMessage";
import ERC721Art from "../src/contracts/ERC721.json";


const HARDHAT_NETWORK_ID = '1337';
const NeverFightTwiceAddr = contractAddress.NeverFightTwice;
const NFTSimpleAddr = contractAddress.NFTSimple;
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;
const options = {method: 'GET', cache: "no-store"};

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

function SettingsProfile() {
    const [selectedAddress, setselectedAddress] = useState('0x0');
    const [txBeingSent, settxBeingSent] = useState('0x0');

    const initialState = {
        // The info of the token (i.e. It's Name and symbol)
        tokenData: undefined,
        // The user's address and balance
        selectedAddress: undefined,
        balance: undefined,
        // The ID about transactions being sent, and any possible error with them
        txBeingSent: undefined,
        transactionError: undefined,
        networkError: undefined,
    };

    const [State, setState] = useState(initialState);
    //setselectedAddress('0x1');
    //console.log("selectedAddress: ", selectedAddress);


    async function _mint_updatePrice(date, price) {

        try {
            console.log("1!!");
            const [ethSelectedAddress] = await window.ethereum.enable();
            console.log("2!!:", ethSelectedAddress);
            //this.setselectedAddress(ethSelectedAddress);
            console.log("3!!");
            // We first initialize ethers by creating a provider using window.ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            console.log("4!!: ", provider);
            // this.web3 = new Web3(this._provider);
            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));
            console.log("5!!: ", zopnftFactory);
            let tx = await zopnftFactory.updatePrice(date, price)
            console.log("6");
            console.log("transaction sent to mint _mint_updatePrice ", date, price);
            setState({ txBeingSent: tx.hash });
            console.log("[updatePrice] tx.hash: ", tx.hash)
            let receipt = await tx.wait()

            /*
            this.setState({ NFTs: this.state.NFTs.concat({
                name: '',
                nftContractName: 'NFTSimple',
                nftContractAddr: this.zopnftFactory.address,
                thumbnail: '',
                openseaLink: '',
                tokenId: receipt.events[0].args[2]
              })});
            */

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            //await this._updateBalance();

        } catch (error) {

            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            console.error(error);
            setState({ transactionError: error });
        } finally {
            setState({ txBeingSent: undefined });
        }
    }
    async function _mint_createZNtoken(asset, token, date, optype) {
        try {
            console.log("1!!");
            let call_put_type;
            if (optype == 0){
                call_put_type = true;
            }else{
                call_put_type = false;
            }

            const [ethSelectedAddress] = await window.ethereum.enable();
            console.log("2!!:", ethSelectedAddress);
            //this.setselectedAddress(ethSelectedAddress);
            console.log("3!!");
            // We first initialize ethers by creating a provider using window.ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            console.log("4!!: ", provider);
            // this.web3 = new Web3(this._provider);
            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));
            console.log("5!!: ", zopnftFactory);
            //let tx = await zopnftFactory.createZNtoken('azuki', 'eth', 20220227, 0)
            let tx = await zopnftFactory.createZNtoken(asset, token, date, call_put_type)
            //console.log("6");
            //console.log("transaction sent to mint _mint_createZNtoken ", 'azuki', 'eth', 20220227, 0);
            console.log("transaction sent to mint _mint_createZNtoken ", asset, token, date, call_put_type);
            setState({ txBeingSent: tx.hash });
            console.log("[createZNtoken] tx.hash: ", tx.hash)
            let receipt = await tx.wait()

            /*
            this.setState({ NFTs: this.state.NFTs.concat({
                name: '',
                nftContractName: 'NFTSimple',
                nftContractAddr: this.zopnftFactory.address,
                thumbnail: '',
                openseaLink: '',
                tokenId: receipt.events[0].args[2]
              })});
            */

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            //await this._updateBalance();

        } catch (error) {

            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            console.error(error);
            setState({ transactionError: error });
        } finally {
            setState({ txBeingSent: undefined });
        }
    }

    async function _mint_buyOP(date, optype, price, amount) {
        try {
            let call_put_type;
            if (optype == 0){
                call_put_type = true;
            }else{
                call_put_type = false;
            }
            console.log("1!!");
            const [ethSelectedAddress] = await window.ethereum.enable();
            console.log("2!!:", ethSelectedAddress);
            //this.setselectedAddress(ethSelectedAddress);
            console.log("3!!");
            // We first initialize ethers by creating a provider using window.ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            console.log("4!!: ", provider);
            // this.web3 = new Web3(this._provider);
            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));
            console.log("5!!: ", zopnftFactory);
            //let tx = await zopnftFactory.buyOP(20220227, 0, 121, ethSelectedAddress, 5);
            //let options_token_addr = await zopnftFactory.expiryToZNtoken(20220227, 121);
            //console.log("ZNtoken-0-20220227-121 addr: ", options_token_addr);

            let tx = await zopnftFactory.buyOP(date, call_put_type, price, ethSelectedAddress, amount);
            let options_token_addr = await zopnftFactory.expiryToZNtoken(date, call_put_type, price);
            console.log("ZNtoken-",date, "-", call_put_type,"-",price," addr: ", options_token_addr);


            //let tx = await zopnftFactory.buyOP(date, price, amount)
            //console.log("6");
            //console.log("transaction sent to mint buyOP: ", 20220227, 121, ethSelectedAddress, 5);
            console.log("transaction sent to mint buyOP: ", date, call_put_type, price, amount);
            setState({ txBeingSent: tx.hash });
            console.log("[buyOP] tx.hash: ", tx.hash)
            let receipt = await tx.wait()

            /*
            this.setState({ NFTs: this.state.NFTs.concat({
                name: '',
                nftContractName: 'NFTSimple',
                nftContractAddr: this.zopnftFactory.address,
                thumbnail: '',
                openseaLink: '',
                tokenId: receipt.events[0].args[2]
              })});
            */

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            //await this._updateBalance();

        } catch (error) {

            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            console.error(error);
            setState({ transactionError: error });
        } finally {
            setState({ txBeingSent: undefined });
        }
    }

    return (
        <>
            <LayoutAdmin
                headTitle="Profile"
                pageClass={"admin"}
            >
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <h4 className="card-title mb-3">Update Price</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className="col-12 mb-3">
                                    <form
                                        onSubmit={(event) => {
                                            // This function just calls the transferTokens callback with the
                                            // form's data.
                                            event.preventDefault();
                                            const formData = new FormData(event.target);
                                            const date = formData.get("date");
                                            const price = formData.get("price");

                                            if (date || price) {
                                                _mint_updatePrice(date, price);
                                            }
                                        }}
                                    >
                                        <div className="col-12 mb-3 form-group">
                                            <label>Date</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="number"
                                                step="1"
                                                name="date"
                                                placeholder="1"
                                                required
                                            />
                                            <label>Price</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="number"
                                                step="1"
                                                name="price"
                                                placeholder="1"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mb-3 form-group">
                                            <input className="btn btn-primary" type="submit" value="Mint" />
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <h4 className="card-title mb-3">Create ZNtoken</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className="col-12 mb-3">
                                    <form
                                        onSubmit={(event) => {
                                            // This function just calls the transferTokens callback with the
                                            // form's data.
                                            event.preventDefault();
                                            const formData = new FormData(event.target);
                                            const asset = formData.get("asset");
                                            const token = formData.get("token");
                                            const date = formData.get("date");
                                            const optype = formData.get("optype");

                                            if (asset || token || date || type) {
                                                _mint_createZNtoken(asset, token, date, optype);
                                            }
                                        }}
                                    >
                                        <div className="col-12 mb-3 form-group">
                                            <label>Asset</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="text"
                                                step="1"
                                                name="asset"
                                                placeholder="azuki"
                                                required
                                            />
                                            <label>Token</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="text"
                                                step="1"
                                                name="token"
                                                placeholder="eth"
                                                required
                                            />
                                            <label>Date</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="number"
                                                step="1"
                                                name="date"
                                                placeholder="1"
                                                required
                                            />
                                            <label>Options Type (Buy:0/Put:1)</label>
                                            <input
                                                className="col-12 mb-3 form-control"
                                                type="number"
                                                step="1"
                                                name="optype"
                                                placeholder="0"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mb-3 form-group">
                                            <input className="btn btn-primary" type="submit" value="Mint" />
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <h4 className="card-title mb-3">Buy Options</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12 mb-3">
                                            <form
                                                onSubmit={(event) => {
                                                    // This function just calls the transferTokens callback with the
                                                    // form's data.
                                                    event.preventDefault();
                                                    const formData = new FormData(event.target);
                                                    const date = formData.get("date");
                                                    const optype = formData.get("optype");
                                                    const price = formData.get("price");
                                                    const amount = formData.get("amount");
                                                    //date, price, amount
                                                    if (date || optype || price || amount) {
                                                        _mint_buyOP(date, optype, price, amount);
                                                    }
                                                }}
                                            >
                                                <div className="col-12 mb-3 form-group">
                                                    <label>date</label>
                                                    <input
                                                        className="col-12 mb-3 form-control"
                                                        type="number"
                                                        step="1"
                                                        name="date"
                                                        placeholder="1"
                                                        required
                                                    />
                                                    <label>Options Type (Buy:0/Put:1)</label>
                                                    <input
                                                        className="col-12 mb-3 form-control"
                                                        type="number"
                                                        step="1"
                                                        name="optype"
                                                        placeholder="0"
                                                        required
                                                    />
                                                    <label>Price</label>
                                                    <input
                                                        className="col-12 mb-3 form-control"
                                                        type="number"
                                                        step="1"
                                                        name="price"
                                                        placeholder="1"
                                                        required
                                                    />
                                                    <label>Amount</label>
                                                    <input
                                                        className="col-12 mb-3 form-control"
                                                        type="number"
                                                        step="1"
                                                        name="amount"
                                                        placeholder="1"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12 mb-3 form-group">
                                                    <input className="btn btn-primary" type="submit" value="Mint" />
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </>
    );

}



export default SettingsProfile;
