import './/agent.css';
const Agent = (props) => {
    return (
        <div className={'agent' + props.add}>

            <img src={props.image} alt=""></img>
            <p>{props.name}</p>

        </div>
    )

}
export default Agent;