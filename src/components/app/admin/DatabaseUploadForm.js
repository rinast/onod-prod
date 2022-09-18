import React from 'react'

export default function DatabaseUploadForm() {

  function imgChangeHandler(e) {
    let selected = e.target.files[0];
    console.log(selected)
  }

  return (
    <>
      <input type="file" onChange={imgChangeHandler} />
    </>
  )
}
