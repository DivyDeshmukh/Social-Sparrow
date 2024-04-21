import React from "react";
import Logo from "../Logo";
import "../../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="overflow-hidden border-t-2 bg-[#ED729F] border-white dark:border-red-500 dark:bg-black pt-12 font-semibold">
      <div id="fp-1">
        <div class="div div1 items-center">
          <Logo className="h-[60px] w-[60px]" />
          <div id="logo">
            <span>Social Sparrow</span>
            <span id="logo-txt">®</span>
          </div>
        </div>
        <div class="div div2">
          <h4 className="text-white dark:text-red-500 font-semibold">About</h4>
          <p>Social Sparrow</p>
          <p>
            <span className="text-slate-600">By </span> Divy Deshmukh
          </p>
          <p>Web Developer</p>
        </div>
        <div class="div div3">
          <h4 className="text-white dark:text-red-500 font-semibold">Links</h4>
          <Link to="attach link after uploading" className="underline">
            SocialSparrow <i class="ri-arrow-right-up-line"></i>
          </Link>
          <Link
            to="https://www.linkedin.com/in/divy-deshmukh-035763235"
            className="underline"
          >
            LinkedIn <i class="ri-arrow-right-up-line"></i>
          </Link>
          <Link to="https://github.com/DivyDeshmukh" className="underline">
            Github <i class="ri-arrow-right-up-line"></i>
          </Link>
          <Link to="https://twitter.com/DeshmukhDivy" className="underline">
            Twitter <i class="ri-arrow-right-up-line"></i>
          </Link>
          <Link to="Resume link" className="underline">
            Resume<i class="ri-arrow-right-up-line"></i>
          </Link>
        </div>
        <div class="div div4">
          <h4 className="text-white dark:text-red-500 font-semibold">
            Contact
          </h4>
          <p>support@social-sparrow.com</p>
          <Link to="mailto:recipient@example.com" className="underline">
            Email
          </Link>
          <Link
            to="https://divydeshmukh.github.io/Portfolio/"
            className="underline"
          >
            Portfolio<i class="ri-arrow-right-up-line"></i>
          </Link>
        </div>
      </div>

      <div id="fp-2">
        <p>&copy; DivyDeshmukh 2024</p>
      </div>
    </footer>
  );
}

export default Footer;
