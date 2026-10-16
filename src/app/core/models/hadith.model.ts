export interface HadithCategory {
  id: string;
  title: string;
  hadeeths_count: string;
  parent_id: string | null;
}

export interface HadithListItem {
  id: string;
  title: string;
  translations: string[];
}

export interface HadithDetail {
  id: string;
  title: string;
  hadeeth: string;
  attribution: string;
  grade: string;
  explanation: string;
}

export interface HadithPage {
  data: HadithListItem[];
  meta: {
    current_page: string;
    last_page: string;
    total_items: string;
    per_page: string;
  };
}
