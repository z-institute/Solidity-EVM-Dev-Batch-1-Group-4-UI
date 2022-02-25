import React, { useState } from "react";
import BrowseCategory from "../components/elements/BrowseCategory";
import TopCollection from "../components/elements/TopCollection";
import LayoutFront from "../components/layout/LayoutFront";
import "react-modal-video/css/modal-video.css";
import dynamic from "next/dynamic";

import Link from "next/link";
import IntroSlider from "../components/slider/IntroSlider";
import NotableDrops from "../components/slider/NotableDrops";
import TrendingSlider from "../components/slider/Trending";

const ModalVideo = dynamic(import("react-modal-video"), {
    ssr: false,
});

//import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "../src/components/Dapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";


const Index = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <LayoutFront pageClass={"front"}>
                <div className="intro1">
                    <div className="container">
                        <div className="row justify-content-between align-items-center">
                            <div className="col-xl-5 col-lg-6 col-12">
                                <div className="intro-content  my-5">
                                    <h1 className="mb-3">
                                        ZOPNFT
                                    </h1>
                                    <h1 className="mb-3">
                                        <span> NFT Options Exchange</span>
                                    </h1>
                                    <p>
                                        on the world's first NFT options trading platform
                                    </p>

                                    <a
                                        onClick={() => setOpen(true)}
                                        className="more c-pointer d-inline-flex"
                                    >
                                        <span>
                                            <i className="bi bi-play-fill"></i>
                                        </span>
                                        Learn more about Options
                                    </a>
                                </div>
                            </div>
                            <div className="col-xl-5 col-lg-6 col-12">
                                <div className="intro-slider">
                                    <IntroSlider />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-6 p-4 text-center"></div>
                <Dapp />
                <div className="top-collection section-padding">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8">
                                <div className="section-title text-center">
                                    <h2>Options Market Overview</h2>
                                    <p>
                                        Options Activity
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <TopCollection />
                        </div>
                    </div>
                </div>

            </LayoutFront>
        </>
    );
};

export default Index;
