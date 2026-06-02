import { buildApp } from "./app";

import {
  startWorker
} from "./queue/worker";

const app = buildApp();
startWorker();

app.listen({
  port: 3000
})
.then(() => {

  console.log(
    "Servidor iniciado"
  );

});