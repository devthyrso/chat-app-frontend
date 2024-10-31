import Lottie from "lottie-react";
import animationWarningLottie from "./animationWarning.json";

const style = {
    width: 100,
    height: 100,
    top: -25,
};

const AnimationWarningLottie = () => {
    return <Lottie loop={true} style={style} animationData={animationWarningLottie} />;
};

export default AnimationWarningLottie;