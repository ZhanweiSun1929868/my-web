import './CityRentalInfo.css';

interface Props {
    data : string[];
}

interface CardProps {
    img : string;
    name : string;
    score : string;
    description : string;
}

function Card({ img, name, score, description} : CardProps) {
    return (
        <div className="card custom-card">
          <img src={img} className="card-img-top custom-card-img" alt={name} />
          <div className="card-body">
            <p className="card-text">Hotel Name : {name}</p>
            <p className="card-text">Score : {score}</p>
            <p className="card-text">Description : {description}</p>
          </div>
        </div>
    );
}

const CityRentalInfo = ({ data } : Props) => {
  return (
    <>
        <div className="row">
            {data.map((item, index) => (
                <div className="col-sm-4 mb-3" key={index}>
                    <Card img={item.img} name={item.name} score={item.score} description={item.description}/>
                </div>
            ))}
        </div>
    </>
  );
};

export default CityRentalInfo;
