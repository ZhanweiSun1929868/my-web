const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors());

// 设置API端点
app.get('/api/homes', async (req, res) => {
  console.log("req:",req);
  const { city, checkin, checkout } = req.query; 
  const url = `https://www.airbnb.cn/s/${city}/homes?refinement_paths%5B%5D=%2Fhomes&checkin=${checkin}&checkout=${checkout}`;

  const browser = await puppeteer.launch({
    timeout: 60000,
  });
  const page = await browser.newPage();
  await page.goto(url);

  console.log(page);

  const homes = await page.$$eval('._gig1e7', homes => {
    return homes.map(home => {
      let img = `https://img1.baidu.com/it/u=3002405289,3053953349&fm=253&fmt=auto&app=138&f=JPEG?w=120&h=160`;
      const imgE1 = home.querySelector('._1szwzht');
      if (imgE1) {
        const imgE2 = imgE1.querySelector('img');
        if (imgE2) {
            img = imgE2.getAttribute('src');
        }
      }
      const nameEl = home.querySelector('._qrfr9x5');
      const name = nameEl ? nameEl.innerText : '1';
      const scoreE1 = home.querySelector('._1clmxfj');
      const score = scoreE1 ? scoreE1.innerHTML.substring(0,3) : '4.5';
      const descriptionEl = home.querySelectorAll('._1pdh8u0');
      const description = [];
      for (let i = 0; i < descriptionEl.length; i++) {
        const element = descriptionEl[i];
        description.push(element.innerHTML);
      };

      return { img, name, score, description };
    });
  });
  

  await browser.close();

  res.json(homes);
});

// 启动服务器
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
