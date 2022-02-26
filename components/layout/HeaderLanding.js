import dynamic from 'next/dynamic';
import Link from "next/link";

const ThemeSwitch = dynamic(() => import('../../components/elements/ThemeSwitch'), {
    ssr: false
})
import React, {useEffect, useState} from "react";
import WalletShow from '../../components/elements/WalletShow';

function HeaderLanding(props) {
    const [isToggled, setToggled] = useState(false);
    const toggleTrueFalse = () => setToggled(!isToggled);

    useEffect(() => {
        console.log('HeaderLanding!!!!!!!!!!!!!');
       // props.setWallet();
    }, []);


    return (
        <>
            <div className="header landing">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="navigation">
                                <nav className="navbar navbar-expand-lg navbar-light">
                                    <div className="brand-logo">
                                        <Link href="/"><a>
                                            <img src="/images/logo.png" alt="" className="logo-primary" />
                                            <img src="/images/logow.png" alt="" className="logo-white" />
                                        </a></Link>
                                    </div>
                                    <button className="navbar-toggler" type="button"onClick={toggleTrueFalse}>
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className={isToggled? "collapse navbar-collapse show" :"collapse navbar-collapse"}>
                                        <ul className="navbar-nav me-auto">
                                            <li className="nav-item">
                                                <Link href="/profile"><a className="nav-link">Profile
                                                </a></Link>
                                            </li>
                                            {/* <li className="nav-item dropdown">
                                                <Link href="#"><a className="nav-link dropdown-toggle" data-toggle="dropdown">Pages
                                                </a></Link>
                                                <div className="dropdown-menu">
                                                    <Link href="/contact"><a className="dropdown-item">Contact us</a></Link>
                                                    <Link href="/helpdesk"><a className="dropdown-item">Help Desk</a></Link>
                                                    <Link href="/privacy-policy"><a className="dropdown-item">Privacy</a></Link>
                                                    <Link href="/faq"><a className="dropdown-item">FAQ</a></Link>
                                                </div>
                                            </li> */}
                                            <li className="nav-item">
                                                <Link href="/settings"><a className="nav-link">settings</a></Link>
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="signin-btn d-flex align-items-center">
                                        {/*<Link href="/connect"><a className="btn btn-primary">Connect</a></Link>*/}
                                        <WalletShow setWallet={props.setWallet}></WalletShow>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default HeaderLanding;
