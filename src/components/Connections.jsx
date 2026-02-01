import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, removeConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      dispatch(removeConnections());
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-xl text-gray-400">
        No connections found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="text-3xl font-bold text-white mb-6">
        Connections ({connections.length})
      </h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="flex items-center gap-4 p-4 my-4 bg-neutral rounded-xl w-1/2 mx-auto shadow"
          >
            <img
              src={photoUrl}
              alt="photo"
              className="w-16 h-16 rounded-full object-cover"
            />

            <div className="text-left">
              <h2 className="font-semibold text-lg">
                {firstName} {lastName}
              </h2>
              {age && gender && (
                <p className="text-sm">
                  {age}, {gender}
                </p>
              )}
              <p className="text-sm text-gray-300">{about}</p>
            </div>
            <Link to={"/chat/" + _id} className="ml-auto">
              <button className="btn btn-primary">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
