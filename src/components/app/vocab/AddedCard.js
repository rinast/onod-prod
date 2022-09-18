import React, {useState, useEffect} from "react";

export default function AddedCard(props) {
  const [roman, setRoman] = useState("");
  const [hangeul, setHangeul] = useState("");

  useEffect(() => {
    if (props.content.includes("/")) {
      setHangeul(props.content.substring(0, props.content.indexOf("/")).trim().replace("/", ""));
      setRoman(props.content.substring(props.content.indexOf("/")).trim().replace("/", ""));
    } else {
      setHangeul(props.content);
    }
  }, [props]);

  return (
    <div
      className="added-card"
      id={props.id}
      key={props.id}
      onClick={() => props.removeFromSelected(props.id, props.content)}
    >
      <span className="missing-card-roman">{roman}</span>
      {hangeul}
    </div>
  );
}
