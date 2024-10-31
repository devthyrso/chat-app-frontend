import Spinner from 'react-bootstrap/Spinner';
import './loaderStyle.css'

function Loading() {
    return (
        <div className="loader_container">
            <Spinner className='spinner_Loader' animation="border" role="status"></Spinner>
        </div>
    )
}

export default Loading