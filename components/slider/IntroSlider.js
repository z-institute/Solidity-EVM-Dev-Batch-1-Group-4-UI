import React from 'react';
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Navigation]);
const IntroSlider = () => {

    const data = [
        {
            img: "1-1.jpg",
            avatar: "1-2.jpg",
            title: "Azuki",
            author: "TeamAzuki"
        },
        {
            img: "2-1.jpg",
            avatar: "2-2.jpg",
            title: "CryptoPunks",
            author: "CryptoPunks"
        },
        {
            img: "3-1.jpg",
            avatar: "3-2.jpg",
            title: "Bored Ape Yacht Club",
            author: "BoredApeYachtClub"
        },
        {
            img: "4-1.jpg",
            avatar: "4-2.jpg",
            title: "CLONE X",
            author: "RTFKTCLONEXTM"
        },
    ];


    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                navigation={{
                    prevEl: ".intro_prev",
                    nextEl: ".intro_next",
                }}
                className="custom-class"
            >
                {data.map((item, i) => (
                    <SwiperSlide>
                        <div className="slider-item">
                            <img
                                src={`/images/items/${item.img}`}
                                alt=""
                                className="img-fluid"
                            />
                            <div className="slider-item-avatar">
                                <img
                                    src={`/images/avatar/${item.avatar}`}
                                    alt=""
                                />
                                <div>
                                    <h5>{item.title}</h5>
                                    <p>{item.author}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div className="arrows">
                    <span className="intro_prev">
                        <i className="bi bi-arrow-left"></i>
                    </span>
                    <span className="intro_next">
                        <i className="bi bi-arrow-right"></i>
                    </span>
                </div>
            </Swiper>


        </>
    );
};

export default IntroSlider;

