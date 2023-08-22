import "../scss/styles.scss";

import Body from "./Component/Body";
import { ComponentFromString } from "./Component/Core/ComponentFromString";
import { Container } from "./Component/Core/Container";

const col1 = new Container({ classes: "col-7 p-0 pe-3" });
col1.addChildren(
  new ComponentFromString({
    htmlString: `  

`,
  })
);

const col2 = new Container({ classes: "col-5 p-0 d-flex flex-column justify-content-between align-self-stretch" });
col2.addChildren(new ComponentFromString({htmlString:`

`}))
col2.addChildren(
  new ComponentFromString({
    htmlString: `

`,
  })
);
mainContainer.addChildren([header, col1, col2]);
Body.render(mainContainer);
