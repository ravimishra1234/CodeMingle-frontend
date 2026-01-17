import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = user;

  const handleSendRequest = async (status) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(_id));
    } catch (err) {}
  };

  return (
    <div className="card bg-neutral w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="profile" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{firstName} {lastName}</h2>
        {age && gender && <p>{age}, {gender}</p>}
        <p>{about}</p>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="badge badge-outline">{skill}</span>
            ))}
          </div>
        )}

        <div className="card-actions justify-center my-4">
          <button className="btn btn-accent" onClick={()=>handleSendRequest("ignored")}>Ignore</button>
          <button className="btn btn-secondary" onClick={()=>handleSendRequest("interested")}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
