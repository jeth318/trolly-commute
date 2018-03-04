export interface Leg {
  Destination: {
    date: string;
    id: string;
    name: string;
    routeIdx: string;
    rtDate: string;
    rtTime: string;
    time: string;
    track: string;
    type: string;
  };
  JourneyDetailRef?: {
    ref: string;
  };
  Origin: {
    date: string;
    id: string;
    name: string;
    routeIdx: string;
    rtDate: string;
    rtTime: string;
    time: string;
    track: string;
    type: string;
  };
  accessibility?: string;
  cancelled: Boolean;
  bgColor: string;
  direction: string;
  fgColor: string;
  id: string;
  name: string;
  sname: string;
  string: string;
  type: string;
}

export interface LegCollection {
  legCollection: {
    Leg: [Leg]
  };
}

export interface PrettyLegsRaw {
  LegsRaw: [
    {
      Leg: LegCollection;
    }
  ];
}

export interface LegsRaw {
  Leg: {} | [{}];
}

export interface LegRow {
  Leg: Leg[];
}

export interface TripTableProps {
  legCollection: LegCollection;
}

export interface TripRowProps {
  key: number;
  id: number;
  onClick: (id: number) => void;
  visible: boolean | null;
  legs: LegRow;
}
export interface TripRowMoreProps {
  visible: boolean;
  legs: LegRow;
}

export interface SearchFormProps {
  resetInputId: (id: string) => void;
  visibleFlash: boolean;
  handleInputFrom: (value: string, id: string) => void;
  handleInputTo: (value: string, id: string) => void;
  handleSubmit: () => void;
  handleSwap: () => void;
  errors: {
    fromId: boolean;
    toId: boolean;
    sameDest: boolean;
  };
}

export interface SuggestionProps {
  id: string;
  lat: number;
  lon: number;
  name: string;
  weight: number;
}

export interface ErrorProps {
  type: string;
}

export interface ClearCirkleProps {
  onClick: (id: string) => void;
}
export interface SearchButtonProps {
  handleSubmit: () => void;
}

export interface FlashProps {
  type: FlashType;
  title: string;
  message: string;
  visible: boolean;
}

export enum FlashType {
  INFO,
  WARNING,
  ERROR,
}