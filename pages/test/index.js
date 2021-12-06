import ContentfulApi from "@utils/ContentfulApi";
import { Config } from "@utils/Config";
import { useState, useEffect } from "react";
import Script from 'next/script'
import TestStyles from "@styles/Test.module.css";

function ClientSideComponent(props) {
    const [message, setMessage] = useState("First Message");

  document.body.style.overflowX = "hidden";
  document.body.style.overflowY = "scroll";

  document.body.style.overscrollBehavior = "none";
  document.body.style.height = "100vh";

    useEffect(function() {
        setTimeout(function() {
          gsap.registerPlugin(ScrollTrigger)

          let container = document.getElementsByClassName(TestStyles.container)[0];
          
          gsap.to(container, {
            x: () => -(container.scrollWidth - document.documentElement.clientWidth) + "px",
            ease: "none",
            scrollTrigger: {
              trigger: container,
              invalidateOnRefresh: true,
              pin: true,
              scrub: 1,
              end: () => "+=" + container.offsetWidth
            }
          })

        }, 2000);
    }, []);

    return <></>
}

export default function BlogIndex(props) {
  const {
    postSummaries,
    currentPage,
    totalPages,
    pageContent,
    preview,
  } = props;

  return (
    <>
    <Script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/gsap-latest-beta.min.js?r=5426" strategy={"beforeInteractive"}></Script>
    <Script src="https://assets.codepen.io/16327/ScrollTrigger.min.js" strategy='beforeInteractive'></Script>
    {
        typeof window !== "undefined" && <ClientSideComponent />
    }
    <div className={TestStyles.container}>
      <div className={TestStyles.module + " " + TestStyles.green}></div>
      <div className={TestStyles.module + " " + TestStyles.yellow}></div>
      <div className={TestStyles.module + " " + TestStyles.purple}></div>
      <div className={TestStyles.module + " " + TestStyles.orange}></div>
      <div className={TestStyles.module + " " + TestStyles.blue}></div>
      <div className={TestStyles.module + " " + TestStyles.red}></div>
    </div>
    </>
  );
}

export async function getStaticProps({ preview = false }) {
  const postSummaries = await ContentfulApi.getPaginatedPostSummaries(1);
  const pageContent = await ContentfulApi.getPageContentBySlug(
    Config.pageMeta.blogIndex.slug,
    {
      preview: preview,
    },
  );

  const totalPages = Math.ceil(
    postSummaries.total / Config.pagination.pageSize,
  );

  return {
    props: {
      preview,
      postSummaries: postSummaries.items,
      totalPages,
      currentPage: "1",
      pageContent: pageContent || null,
    },
  };
}
