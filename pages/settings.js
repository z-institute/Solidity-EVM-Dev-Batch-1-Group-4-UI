import UpdateInfo from "../components/form/UpdateInfo";
import LayoutAdmin from "../components/layout/LayoutAdmin";
import PersonalInfo from "../components/form/PersonalInfo";
import UpdateAvatar from "../components/form/UpdateAvatar";
import SettingsMenu from "../components/layout/SettingsMenu";
import {ErrorMessage, Field} from "formik";
import React from "react";

import { Dapp } from "../src/components/Dapp";

function SettingsProfile() {

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
                        <h4 className="card-title mb-3">Update Profile</h4>
                        <div className="card">
                            <div className="card-body">
                                <UpdateInfo />
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-12">
                                <h4 className="card-title mb-3">Personal Information</h4>
                        <div className="card">
                            <div className="card-body">
                                <PersonalInfo />
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </>
    );

}

async function _mint_updatePrice(date, price) {

    try {
        this._dismissTransactionError();

        let tx = await this.zopnftFactory.createZNtoken(20220227, 111)
        console.log("transaction sent to mint _mint_updatePrice ", 20220227, 111);
        this.setState({ txBeingSent: tx.hash });
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

        await this._updateBalance();

    } catch (error) {

        if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
            return;
        }

        console.error(error);
        this.setState({ transactionError: error });
    } finally {

        this.setState({ txBeingSent: undefined });
    }
}




export default SettingsProfile;
