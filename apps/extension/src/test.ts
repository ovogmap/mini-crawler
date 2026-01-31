const recipe = {
  title: "채용 후보자 상세 평가 수집",
  config: {
    targetUrl: "https://app.ninehire.com/...",
    loop: {
      type: "PAGINATION_BUTTON",
      selector: "button[aria-label='Next applicant']",
      limit: 20,
    },
  },
  recipe: [
    {
      id: "step_1",
      action: "click",
      position: "move",
      description: "접수 정보 탭 클릭",
      selector: "button:has-text('접수 정보')",
    },
    {
      id: "step_2",
      action: "click",
      position: "move",
      description: "상세 보기 모달 열기",
      selector: ".applicant-detail-trigger",
    },
    {
      id: "step_3",
      action: "extract",
      position: "collector",
      label: "이름",
      selector: "h1.name",
    },
    {
      id: "step_4",
      action: "extract",
      position: "collector",
      label: "평가내용",
      selector: ".evaluation-text-area",
    },
  ],
};
