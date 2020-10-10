import { app } from './app';
import * as env from './env';
app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
