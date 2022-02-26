import { useEffect, useState } from "react";
import Bottom from "./Bottom";
import Footer from "./Footer";
import Header from "./Header";
import HeaderLanding from "./HeaderLanding";
import PageHead from "./PageHead";
import PageTitleLanding from "./PageTitleLanding";
import Sidebar from "./sidebar";

const LayoutFront = ({
    headTitle,
    children,
    pageTitle,
    pageTitleSub,
    pageClass,
    parent,
    child,
    setWallet
}) => {
    const [height, setHeight] = useState();
    useEffect(() => {
        setHeight(window.screen.height);
        console.log('layoutFront!!!!!!!!!!!!!');
        //setWallet();
    }, []);
    return (
        <>
            <PageHead headTitle={headTitle} />
            <div id="main-wrapper" className={pageClass}>
                <HeaderLanding setWallet={setWallet}/>

                    {pageTitle && (
                        <PageTitleLanding
                            pageTitle={pageTitle}
                            pageTitleSub={pageTitleSub}
                            parent={parent}
                            child={child}
                        />
                    )}

               
                    {children}
              

                <Bottom />
                <Footer />
            </div>
        </>
    );
};

export default LayoutFront;
