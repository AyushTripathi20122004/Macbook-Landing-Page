import './style.css'

import AppleLogo from './assets/CompanyLogo/AppleLogo.svg'

import introText from './assets/IntroImages/introText.png';
import laptopVideo from './assets/IntroImages/LaptopVideo.mp4';

import GameVideo from './assets/GameVideo/game.mp4'
import M4logo from './assets/GameVideo/M4Logo.svg'

import GraphicsMainImg from './assets/GraphicsPerformance/performance5.jpg'
import lwImg1 from './assets/GraphicsPerformance/LeftWing/performance1.png'
import lwImg2 from './assets/GraphicsPerformance/LeftWing/performance6.png'
import lwImg3 from './assets/GraphicsPerformance/LeftWing/performance7.png'
import rwImg1 from './assets/GraphicsPerformance/RightWing/performance2.png'
import rwImg2 from './assets/GraphicsPerformance/RightWing/performance3.png'
import rwImg3 from './assets/GraphicsPerformance/RightWing/performance4.png'

import featureIcon1 from './assets/Features/feature-icon1.svg';
import featureIcon2 from './assets/Features/feature-icon2.svg';
import featureIcon3 from './assets/Features/feature-icon3.svg';
import featureIcon4 from './assets/Features/feature-icon4.svg';
import featureIcon5 from './assets/Features/feature-icon5.svg';


import udleftBgImg1 from './assets/Upgrades/Card1-bg.png'
import laptop from './assets/Upgrades/Laptop.png'
import Sun from './assets/Upgrades/sun.png'
import Ai from './assets/Upgrades/ai.png'
import Battery from './assets/Upgrades/battery.png'


// navigation element code
const navigationRoutes = [
	{ name: 'Store', route: '#store' },
	{ name: 'Mac', route: '#mac' },
	{ name: 'iPhone', route: '#iphone' },
	{ name: 'watch', route: '#watch' },
	{ name: 'Vision', route: '#vision' },
	{ name: 'AirPods', route: '#airpods' },
]

const navigation = document.querySelector('.nav-links')

navigationRoutes.forEach((elem) => {
	const link = document.createElement('a')
	link.className = 'text-white/70 hover:text-white transition-all duration-300'
	link.innerHTML = elem.name
	link.href = elem.route
	navigation.append(link)
})

// image and video insertion 

// navigation logo
document.querySelector('.navLogo').src=AppleLogo;
// footer logo
document.querySelector('.footerLogo').src=AppleLogo;




// add imgage of intro text
document.querySelector('.introText').src = introText;
// add intro video
const videoSource = document.querySelector('#intro-video-source');
const video = document.querySelector('.intro-video');

videoSource.src = laptopVideo;

// Reload the video after changing the source
video.load();

// adding game video 
const gameVideo = document.querySelector('.gameVideo');
const gameVideoSrc = document.querySelector('#gameVideoSrc');
gameVideoSrc.src = GameVideo;
gameVideo.load();

// image over the game video
document.querySelector('.M4Logo').src = M4logo;

// graphics performance image insertion here

document.querySelector('.GrphicsMainImg').src = GraphicsMainImg;

// graphics performance left wing images 
const leftwingImg = [
	{ classname: '.lw-img1', imglink: lwImg1 },
	{ classname: '.lw-img2', imglink: lwImg2 },
	{ classname: '.lw-img3', imglink: lwImg3 },
]

leftwingImg.forEach((elem, idx) => {
	const ImgWrapper = document.querySelector(elem.classname);
	console.log(elem.classname);

	ImgWrapper.querySelector("img").src = elem.imglink;
})

//graphics performance right wing images
const RightWingImg = [
	{ classname: '.rw-img1', imglink: rwImg1 },
	{ classname: '.rw-img2', imglink: rwImg2 },
	{ classname: '.rw-img3', imglink: rwImg3 },
]

RightWingImg.forEach((elem, idx) => {
	const ImgWrapper = document.querySelector(elem.classname);
	ImgWrapper.querySelector('img').src = elem.imglink;
})


// feature section cards icons add here

const featureIcon = [
	{ classname: '.feature-icon1', imglink: featureIcon1 },
	{ classname: '.feature-icon2', imglink: featureIcon2 },
	{ classname: '.feature-icon3', imglink: featureIcon3 },
	{ classname: '.feature-icon4', imglink: featureIcon4 },
	{ classname: '.feature-icon5', imglink: featureIcon5 },
];

featureIcon.forEach((elem,idx)=>{
	document.querySelector(elem.classname).src=elem.imglink;
})


// upgrade section images add here

document.querySelector('.ud-left-bg-img1').src=udleftBgImg1;

const UdLeftWing=[
	{ classname: '.ud-left-img1', imglink: laptop },
	{ classname: '.ud-left-img2', imglink: Sun }
]

UdLeftWing.forEach((elem,idx)=>{
	document.querySelector(elem.classname).src=elem.imglink;
})

const UdRightWing=[
	{ classname: '.ud-right-img1', imglink: Ai },
	{ classname: '.ud-right-img2', imglink: Battery }
]

UdRightWing.forEach((elem,idx)=>{
	document.querySelector(elem.classname).src=elem.imglink;
})

