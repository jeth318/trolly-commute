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

export interface StopLocation {
  id: string,
  name: string,
  lat: Number,
  lon: Number,
  weight: Number
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

export interface SwapCircleProps {
  handleSwap: () => void;
}

export interface SemanticSearchProps {
  identifier: string,  
  onSelect: (value, identifier) => void;
  onChange: (value, identifier) => void;
  swap: Boolean,
  value: string,
  storedlocation: { name: string, id: string }
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