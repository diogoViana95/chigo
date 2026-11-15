'use client';

import React from 'react';

type ReactWithViewTransitions = typeof React & {
  unstable_ViewTransition?: React.ExoticComponent<React.ViewTransitionProps>;
};

const reactWithViewTransitions = React as ReactWithViewTransitions;
const NativeViewTransition = React.ViewTransition ?? reactWithViewTransitions.unstable_ViewTransition;

export function ViewTransition(props: React.ViewTransitionProps) {
  if (!NativeViewTransition) return <>{props.children}</>;
  return <NativeViewTransition {...props}>{props.children}</NativeViewTransition>;
}
