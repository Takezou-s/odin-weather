import "../scss/styles.scss";

import Body from "./Component/Body";
import { ComponentFromString } from "./Component/Core/ComponentFromString";
import { Container } from "./Component/Core/Container";

// Body.render(new ComponentFromString({ htmlString: `<h1>Deneme</h1>` }));
const mainContainer = new Container({
  classes: "row vw-100 vh-100 m-0 align-items-start align-content-start row-gap-4 p-3",
  // styles: { backgroundImage: "url('./img/fountainhead-palace.png')", backgroundSize: "cover" },
});
// const header = new Container({ classes: "col-12 bg-dark bg-opacity-75" });
// header.addChildren(
//   new ComponentFromString({
//     htmlString: `
//     <div class="fs-1 px-4 py-4">Weather</div>
// `,
//   })
// );
// const col1 = new Container({ classes: "col-3" });
// col1.addChildren(
//   new ComponentFromString({
//     htmlString: `
//     <div class="d-grid gap-2 bg-dark bg-opacity-75 px-4 py-2 pb-3 rounded-3">
//         <div class="display-2 ">Clear Sky</div>
//         <div class="display-3 text-truncate">İzmir</div>
//         <div class="display-6 fs-5 mt-2">Friday, 4th Aug '23</div>
//         <div class="display-6 fs-5">12:38 pm</div>
//         <div class="display-1">34 °C</div>
//     </div>
// `,
//   })
// );

// const col2 = new Container({ classes: "offset-6 col-3" });
// const col3 = new Container({ classes: "col-12" });

// mainContainer.addChildren([header, col1, col2, col3]);

const header = new Container({ classes: "col-12 p-0" });
header.addChildren(
  new ComponentFromString({
    htmlString: `
<input type="text" class="form-control" id="searchCityInput" placeholder="Search for cities">
`,
  })
);

const col1 = new Container({ classes: "col-7 p-0 pe-3" });
col1.addChildren(
  new ComponentFromString({
    htmlString: `
<div class="row m-0 row-gap-3">
  <div class="col-8 p-0 d-flex flex-column">
    <span class="fs-1 lh-1 fw-medium">Madrid</span>
    <span class="fs-4 lh-1 fw-medium">Spain</span>
    <span class="opacity-75 mt-2">Chance of rain: 0%</span>
    <span class="fw-semibold display-2 mt-auto">31 °C</span>
  </div>
  <div class="col-4 p-0">
    <div style="height: 240px">
      Resim
    </div>
  </div>
  
  <div class="col-12 row bg-secondary rounded-4 m-0 p-4 row-gap-3">
    <div class="opacity-75 m-0 p-0">AIR CONDITIONS</div>
    <div class="col-6 d-flex m-0 p-0">
      <div class="opacity-75">Icon</div>
      <div>
        <div class="opacity-75">
          Real Feel
        </div>
        <div class="fs-2 fw-semibold">
          30 °C
        </div>
      </div>
    </div>
  </div>
</div>
`,
  })
);

const col2 = new Container({ classes: "col-5 p-0 d-flex flex-column justify-content-between align-self-stretch" });
col2.addChildren(new ComponentFromString({htmlString:`
<div class="col-12 row bg-secondary rounded-4 m-0 p-4 row-gap-3">
  <div class="col-12 opacity-75 fw-medium m-0 p-0">
    TODAY'S FORECAST
  </div>
  <div class="col-2 d-flex flex-column align-items-center gap-2 m-0 p-0">
    <span class="opacity-75 fw-medium">06:00</span>
    <span style="height: 50px">Resim</span>
    <span class="fs-4 fw-semibold">25 °C</span>
  </div>
</div>
`}))
col2.addChildren(
  new ComponentFromString({
    htmlString: `
<div class="bg-secondary rounded-4 p-4">
  <span class="opacity-75 fw-medium">3-DAY FORECAST</span>
  <div class="row m-0 mt-3 p-0 align-items-center">
    <span class="col-3 m-0 p-0 opacity-75">Today</span>
    <span class="col-3 m-0 p-0 d-flex justify-content-center align-items-center" style="height: 50px">Resim</span>
    <span class="col-3 m-0 p-0 fw-semibold">Sunny</span>
    <span class="col-3 m-0 p-0 d-flex justify-content-end">
      <strong>36</strong>
      22
    </span>
  </div>
</div>
`,
  })
);
mainContainer.addChildren([header, col1, col2]);
Body.render(mainContainer);
