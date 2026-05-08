import { Fragment, ReactNode } from 'react';

const BRAND = 'AdSync.io';

export function BrandBadge() {
  return (
    <span className="brand-badge" aria-hidden="true">
      HUMAN ADTECH
    </span>
  );
}

type Props = {
  text: string;
  as?: 'span' | 'div';
};

export default function BrandedText({ text, as = 'span' }: Props) {
  const parts = text.split(BRAND);
  const rendered: ReactNode[] = [];
  parts.forEach((part, i) => {
    rendered.push(<Fragment key={`p-${i}`}>{part}</Fragment>);
    if (i < parts.length - 1) {
      rendered.push(
        <Fragment key={`b-${i}`}>
          <span className="brand-name">{BRAND}</span>
          <BrandBadge />
        </Fragment>,
      );
    }
  });
  const Tag = as;
  return <Tag>{rendered}</Tag>;
}
