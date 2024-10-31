import Lottie from "lottie-react";
import animationUsersLottie from "./usersAnimation.json";

const style = {
    height: 70,
};

const AnimationUsersLottie = () => {
    return <Lottie loop={true} style={style} animationData={animationUsersLottie} />;
};

export default AnimationUsersLottie;