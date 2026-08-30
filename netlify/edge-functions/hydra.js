import worker from '../../runtime/server/index.js';

export default function hydra(request) {
  return worker.fetch(request);
}

