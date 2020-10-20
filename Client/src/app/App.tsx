import React, { lazy, Suspense } from 'react';
import { boundary, useError } from 'react-boundary';

import { InvalidUsage } from './InvalidUsage';
import { Loading } from './Loading';

const Bynder = lazy(() => import('./element/Bynder').then((module) => ({ default: module.Bynder })));
const Error = lazy(() => import('./Error').then((module) => ({ default: module.Error })));

export const App = boundary(() => {
  const [error, info] = useError();

  if (error || info) {
    return <Error stack={`${error && error.stack}${info && info.componentStack}`} />;
  }

  const invalidUsage = global.self === global.top;

  return (
    <Suspense fallback={<Loading />}>
      {invalidUsage && <InvalidUsage />}
      {!invalidUsage && <Bynder />}
    </Suspense>
  );
});
