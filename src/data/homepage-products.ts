export type HomepageFeaturedProductConfig = {
  id: string;
  displayName?: string;
};

export const homepageFeaturedProductConfigs: readonly HomepageFeaturedProductConfig[] =
  [
    {
      id: "batuta-paper-holder",
      displayName: "벨레어 휴지걸이",
    },
    {
      id: "hg05",
    },
    {
      id: "hg55s",
    },
    {
      id: "hg100ms",
    },
    {
      id: "hg110s",
    },
    {
      id: "hg112s",
    },
    {
      id: "hg392ms",
    },
    {
      id: "hg513",
    },
    {
      id: "hg822s",
    },
    {
      id: "hg9992",
    },
  ] as const;
