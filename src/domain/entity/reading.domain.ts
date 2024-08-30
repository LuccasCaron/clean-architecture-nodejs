import { v4 as uuidv4 } from "uuid";

export enum MeasureType {
  WATER = "WATER",
  GAS = "GAS",
}

export type ReadingProps = {
  id: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasureType;
  value: number;
  image_url: string;
  confirmed: boolean;
  createAt: Date;
  updatedAt?: Date;
};

export class Reading {
  private constructor(private props: ReadingProps) {}

  public static create(
    customer_code: string,
    measure_type: MeasureType,
    value: number,
    image_url: string
  ) {
    return new Reading({
      id: uuidv4(),
      customer_code,
      measure_datetime: new Date(),
      measure_type,
      value,
      image_url,
      confirmed: false,
      createAt: new Date(),
    });
  }

  public static with(props: ReadingProps) {
    return new Reading(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get customer_code(): string {
    return this.props.customer_code;
  }

  public get measure_datetime(): Date {
    return this.props.measure_datetime;
  }

  public get measure_type(): MeasureType {
    return this.props.measure_type;
  }

  public get value(): number {
    return this.props.value;
  }

  public get image_url(): string {
    return this.props.image_url;
  }

  public get confirmed(): boolean {
    return this.props.confirmed;
  }

  public get createAt(): Date {
    return this.props.createAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
