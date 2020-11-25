/* 
Quick Summary:
Scraping the article listing from the website
*/

import axios from "axios";
import cheerio from "cheerio";

export const getFirstPost = async () => {
  try {
    //retrieving article
    const { data } = await axios.get(
      "https://www.proteinreport.org/cultivated"
    );
    const $ = cheerio.load(data);
    const firstPost = $("div.field-content > a").attr("href");
    return firstPost;
  } catch (error) {
    throw error;
  }
};
