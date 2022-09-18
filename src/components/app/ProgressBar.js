import React, {useState, useEffect} from "react";

export default function ProgressBar(props) {
  const [progress, setProgress] = useState(0);

  let total = progress/100*70;

  useEffect(() => {
    setProgress(100/props.total*(props.current))
  }, [props])

  return (
    <>
      <div className="lesson-progress-bar"></div>
      <div className="lesson-progress-bar-fill" style={{width: `${total}vw`}}></div>
      <div className="lesson-progress-bar-percent">{Math.round(progress)}%</div>
    </>
  );
}
