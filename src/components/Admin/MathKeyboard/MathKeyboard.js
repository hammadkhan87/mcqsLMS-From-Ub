import React, { useState } from "react";
// import { MathComponent } from "mathjax-react";
// import { MathJaxContext, MathJax } from "better-react-mathjax";
// import "./MathKeyboard.scss";
// import { NavItem } from "react-bootstrap";

const MathKeyboard = ({ updateSymbols }) => {
  // const [ans, setAns] = useState([]);
  // const config = {
  //   loader: { load: ["input/asciimath"] },
  // };

  // const handleonSubmit = () => {
  //   updateSymbols(ans);
  //   console.log("aa");
  // };

  // const onclickhandle = (value) => {
  //   setAns((ans) => [...ans, value]);
  //   console.log(ans);
  // };
  // const handleCancle = () => {
  //   if (ans.length >= 1) {
  //     // setAns((ans)=>[ans.pop()])
  //     setAns((ans) => ans.slice(0, ans.length - 1));
  //   }

  //   console.log(ans);
  // };

  return (
    <div className="main-keyboard">
      {/* <MathJaxContext config={config}>
        <div className="type-result">
          <div>
            {" "}
            {ans.map((item) => {
              return (
                <MathJax
                  style={{ display: "inline-block", margin: "5px" }}
                >{`${item}`}</MathJax>
              );
            })}
          </div>

          <button className="btn-cancle" onClick={handleCancle}>
            cancle
          </button>
        </div>

        <div className="grid-container">
          <button onClick={() => onclickhandle("`a^2`")}>
            <MathJax>{"`a^2`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`a^(x)`")}>
            <MathJax>{"`a^(x)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`a_x`")}>
            <MathJax>{"`a_x`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`root(x)(a)`")}>
            <MathJax>{"`root(x)(a)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`frac(a)x`")}>
            <MathJax>{"`frac(a)x`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`| x |`")}>
            <MathJax>{"`| x |`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`ceil(x)`")}>
            <MathJax>{"`ceil(x)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`floor(x)`")}>
            <MathJax>{"`floor(x)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`frac(dx)(dy)`")}>
            <MathJax>{"`frac(dx)(dy)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`(partialx)/(partialy)`")}>
            <MathJax>{"`(partialx)/(partialy)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`int_x^y`")}>
            <MathJax>{"`int_x^y`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`oint_x^y`")}>
            <MathJax>{"`oint_x^y`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`log_x(y)`")}>
            <MathJax>{"`log_x(y)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`lim_(x->y)`")}>
            <MathJax>{"`lim_(x->y)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`sum_x^y`")}>
            <MathJax>{"`sum_x^y`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`prod_x^y`")}>
            <MathJax>{"`prod_x^y`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`vec(x)/(y)`")}>
            <MathJax>{"`vec(x)/(y)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`overline(xy)`")}>
            <MathJax>{"`overline(xy)`"}</MathJax>
          </button>

          <button onClick={() => onclickhandle("`vec(xy)`")}>
            <MathJax>{"`vec(xy)`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`cdot`")}>
            <MathJax>{"`cdot`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`pm`")}>
            <MathJax>{"`pm`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`ne`")}>
            <MathJax>{"`ne`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`le`")}>
            <MathJax>{"`le`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`ge`")}>
            <MathJax>{"`ge`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`equiv`")}>
            <MathJax>{"`equiv`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`sim`")}>
            <MathJax>{"`sim`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`approx`")}>
            <MathJax>{"`approx`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`pi`")}>
            <MathJax>{"`pi`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`theta`")}>
            <MathJax>{"`theta`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`cong`")}>
            <MathJax>{"`cong`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`Delta`")}>
            <MathJax>{"`Delta`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`alpha`")}>
            <MathJax>{"`alpha`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`beta`")}>
            <MathJax>{"`beta`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`nabla`")}>
            <MathJax>{"`nabla`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`angle`")}>
            <MathJax>{"`angle`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`propto`")}>
            <MathJax>{"`propto`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`infty`")}>
            <MathJax>{"`infty`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`gamma`")}>
            <MathJax>{"`gamma`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`delta`")}>
            <MathJax>{"`delta`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`epsilon`")}>
            <MathJax>{"`epsilon`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`phi`")}>
            <MathJax>{"`phi`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`chi`")}>
            <MathJax>{"`chi`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`iota`")}>
            <MathJax>{"`iota`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`omega`")}>
            <MathJax>{"`omega`"}</MathJax>
          </button>
          <button onClick={() => onclickhandle("`lamda`")}>
            <MathJax>{"`lamda`"}</MathJax>
          </button>
        </div>
      </MathJaxContext>
      {/* <MathComponent>
 <p
 tex={String.raw`\int_0^1 x^2\ dx`}
 ></p>

 </MathComponent> */}
      {/* <button className="btn-submit" onClick={handleonSubmit}>
        Submit
      </button>  */}
    </div>
  );
};

export default MathKeyboard;
