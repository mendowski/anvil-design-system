import * as React from "react";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Emphasis. primary = the main action on a page; secondary = an important alternative; tertiary = a lower-priority standalone action that looks like a link. Default "primary". */
  variant?: "primary" | "secondary" | "tertiary";
  /** Red treatment for actions that delete or can't be undone. Default false. */
  destructive?: boolean;
  /** Only tertiary buttons have a small size (14px label). Default "default". */
  size?: "default" | "small";
  /** Where the icon sits. Default "none". */
  icon?: "none" | "left" | "right";
  /** An Anvil icon to show. Default "plus". */
  iconName?: IconName;
  /** A custom icon instead of an Anvil one. Pass a 16px SVG that uses currentColor. */
  iconNode?: React.ReactNode;
  /** Shows a spinner and disables the button. The spinner replaces the icon, or sits on the right when there is none. */
  loading?: boolean;
  disabled?: boolean;
  /** Renders an <a> instead of a <button>, for navigation. */
  href?: string;
  /** Forces a visual state for documentation and prototypes. Leave unset in real use. */
  state?: "hover" | "focus" | "pressed";
  /** The label. Keep it to a short verb phrase. */
  children: React.ReactNode;
}

export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare function PlusIcon(): React.ReactElement;

/** Every icon exported from the Anvil Figma Icons page. */
export type IconName = "home" | "ellipsis" | "menu" | "arrow-left" | "arrow-right" | "arrow-down" | "arrow-up" | "search" | "reload" | "refresh" | "external-link" | "unlock" | "lock" | "close" | "close-circle" | "check" | "check-circle" | "alert" | "error" | "info" | "bullet" | "bookmark" | "link" | "unlink" | "plus" | "plus-circle" | "minus" | "remove" | "filter" | "logs" | "trash" | "edit" | "calendar" | "calendar-plus" | "attachment" | "camera" | "photo" | "copy" | "blood-sugar" | "blood-pressure" | "behavioral-health" | "weight" | "food" | "steps" | "library" | "heart-pulse" | "doctor-bag" | "stethoscope" | "checklist" | "no-smoking" | "coronavirus" | "wheelchair" | "medical-info" | "medicine" | "stop" | "primary-care" | "health-info" | "profile" | "group" | "language" | "device" | "programs" | "supplies" | "authorization" | "lab" | "reminder" | "mute" | "sign-out" | "apple-watch" | "show-password" | "hide-password" | "credit-card" | "emergency-contact" | "past-visits" | "insurance" | "family" | "settings" | "volume-more" | "volume-less" | "volume-off" | "airplane" | "brightness-low" | "brightness-medium" | "brightness-high" | "hearing-impaired" | "wifi" | "chart" | "download" | "upload" | "document" | "share" | "sort" | "star" | "thumb-up" | "thumb-down" | "meal" | "mood-joy" | "mood-happy" | "mood-neutral" | "mood-unhappy" | "mood-terrible" | "sun" | "moon" | "umbrella" | "plant" | "gauge-low" | "gauge" | "gauge-high" | "chat" | "help" | "phone" | "map-signs" | "location-pin" | "mail" | "paper-airplane" | "video" | "video-off" | "microphone" | "microphone-off" | "printer" | "clock" | "media" | "skip-15-backward" | "skip-15-forward" | "sleep" | "activity" | "power" | "cloud-disconnected" | "control-solution" | "alert-triangle" | "resilience" | "empowerment" | "training" | "care" | "spending" | "saving" | "caret-down" | "data-up" | "data-down" | "alert-lightbulb" | "glucose" | "body-composition" | "tag" | "card-empty" | "card-visa" | "card-mastercard" | "card-american-express" | "card-unknown" | "card-cvc" | "arrow-swap" | "health-insights" | "headset" | "camera-ai" | "flash" | "flash-off" | "flash-auto" | "barcode" | "filter-sort" | "my-location" | "directions" | "calendar-warning" | "line-arrow-down" | "line-arrow-up" | "line-arrow-right" | "line-arrow-left" | "send" | "ai-sparkle" | "pin" | "expand" | "collapse" | "pin-slash" | "ai-sparkles";

export interface IconProps {
  /** Which icon. */
  name: IconName;
  /** "default" is the outline style; "active" is the filled style used for selected states. Sort also has "up" and "down". Default "default". */
  variant?: "default" | "active" | "up" | "down" | string;
  /** Height in px. Default 16. The card icons are wider than they are tall and scale to match. */
  size?: number;
  /** Any CSS color. By default the icon uses the surrounding text color. */
  color?: string;
  /** An accessible name. Leave it out for decorative icons next to text, which are hidden from screen readers. */
  title?: string;
  className?: string;
}

export declare function Icon(props: IconProps): React.ReactElement | null;
export declare namespace Icon {
  const names: IconName[];
  function variants(name: IconName): string[];
}

export interface FieldProps {
  /** Field label. */
  label?: React.ReactNode;
  /** Short hint under the label. */
  helper?: React.ReactNode;
  /** Inline message under the control. */
  message?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface TextInputProps extends FieldProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  name?: string;
  /** "warning" or "error". Shows the message with the matching icon. */
  status?: "warning" | "error";
  /** Text such as "lbs" or "$". */
  unit?: string;
  unitPosition?: "before" | "after";
  /** An Anvil icon before the text. */
  icon?: IconName;
  disabled?: boolean;
  /** View-only: readable and copyable, with a lock icon. */
  readOnly?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
  /** Forces a visual state for documentation. */
  state?: "hover" | "focus";
}
export declare function TextInput(props: TextInputProps): React.ReactElement;

export interface PasswordRequirement { label: string; test?: (value: string, excludeWords?: string[]) => boolean; met?: boolean; }
export interface PasswordInputProps extends FieldProps {
  /** "sign-in" (default) or "create", which adds strength and requirements. */
  mode?: "sign-in" | "create";
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  status?: "error";
  disabled?: boolean;
  readOnly?: boolean;
  /** Start with the password visible. */
  defaultVisible?: boolean;
  requirements?: PasswordRequirement[];
  requirementsTitle?: string;
  /** Words the password must not contain, such as the person's name and email. */
  excludeWords?: string[];
  state?: "hover-input" | "focus-input" | "hover-button" | "focus-button";
}
export declare function PasswordInput(props: PasswordInputProps): React.ReactElement;

export interface CheckboxProps {
  label?: React.ReactNode;
  /** Rich label content, such as text with links. */
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  state?: "hover" | "focus";
  id?: string;
  className?: string;
}
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export interface CheckboxGroupProps extends FieldProps {
  status?: "error";
  children: React.ReactNode;
}
export declare function CheckboxGroup(props: CheckboxGroupProps): React.ReactElement;

export interface SelectionCardProps {
  /** "radio" (default) for pick-one, "checkbox" for pick-any. */
  type?: "radio" | "checkbox";
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Custom body in place of description. */
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string;
  error?: boolean;
  /** Error message shown under the card. */
  message?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  state?: "hover" | "focus";
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function SelectionCard(props: SelectionCardProps): React.ReactElement;

export interface SliderProps extends Omit<FieldProps, "message"> {
  min?: number;
  max?: number;
  step?: number;
  /** A number, or [low, high] when range is true. */
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  /** Two handles. */
  range?: boolean;
  /** "rtl" fills from the handle to the max. */
  direction?: "ltr" | "rtl";
  /** Formats the values shown and read aloud, such as v => v + " lbs". */
  formatValue?: (value: number) => string;
  showValue?: boolean;
  showRange?: boolean;
  disabled?: boolean;
  /** Accessible name when there's no visible label. */
  ariaLabel?: string;
  state?: "hover" | "focus" | "pressed";
  forcedHandle?: 0 | 1;
}
export declare function Slider(props: SliderProps): React.ReactElement;

export interface CardProps {
  eyebrow?: React.ReactNode;
  header?: React.ReactNode;
  /** Heading element for the header. Default "h3". */
  headerAs?: "h2" | "h3" | "h4" | "div";
  headerId?: string;
  /** A control on the right of the header, such as an IconButton. */
  headerAction?: React.ReactNode;
  /** hero = full-width 2:1 on top; spot or avatar = circle at the top right. */
  image?: { type?: "hero" | "spot" | "avatar"; src?: string; alt?: string; node?: React.ReactNode; icon?: IconName };
  /** Main content. */
  children?: React.ReactNode;
  /** Buttons. */
  footer?: React.ReactNode;
  footerStyle?: "default" | "filled";
  as?: "section" | "article" | "div" | "li";
  className?: string;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): React.ReactElement;

export interface NavItemProps { label: string; href?: string; onClick?: () => void; icon?: IconName; badge?: number | boolean; current?: boolean; state?: "hover" | "focus"; }
export interface GlobalHeaderProps {
  type?: "default" | "focused" | "progress";
  /** Your logo element. Defaults to a text wordmark. */
  logo?: React.ReactNode;
  nav?: NavItemProps[];
  /** Icon + label links on the right, such as Profile and Messages. */
  utilities?: NavItemProps[];
  /** Current language, shown as a tertiary button. */
  language?: string;
  onLanguage?: () => void;
  /** Country, for logged-out pages. */
  country?: string;
  onCountry?: () => void;
  cta?: { label: string; href?: string; onClick?: () => void };
  /** Mobile focused-task title. */
  title?: string;
  steps?: string[];
  /** 0-based. */
  currentStep?: number;
  /** For mobile when steps aren't listed. */
  totalSteps?: number;
  stepLabel?: string;
  /** 0 to 1. Defaults to (currentStep + 1) / steps. */
  progress?: number;
  /** null hides Back. */
  onBack?: (() => void) | null;
  backLabel?: string;
  /** null hides Close/Exit. */
  onClose?: (() => void) | null;
  closeLabel?: string;
  /** Force a layout. By default it switches at 768px of its own width. */
  layout?: "desktop" | "mobile";
  className?: string;
  style?: React.CSSProperties;
}
export declare function GlobalHeader(props: GlobalHeaderProps): React.ReactElement;
export declare function IconButton(props: { icon: IconName; label: string; href?: string; onClick?: () => void; badge?: number | boolean; current?: boolean; className?: string }): React.ReactElement;
export declare function InlineMessage(props: { status?: "error" | "warning" | "success" | "info"; id?: string; children: React.ReactNode }): React.ReactElement;

export type SpotBackground = "purple" | "purple-subdued" | "aqua" | "aqua-subdued" | "green" | "green-subdued" | "berry" | "berry-subdued" | "neutral-0" | "neutral-1" | "neutral-2" | "neutral-3" | "none";
export type HeroBackground = "purple-subdued" | "aqua-subdued" | "green-subdued" | "berry-subdued" | "neutral-0" | "neutral-1" | "neutral-2" | "neutral-3" | "none";
export interface IllustrationProps {
  /** spot = small square or circle (72px); hero = full-width 2:1 scene. Default "spot". */
  type?: "spot" | "hero";
  /** Background color. Spot default "purple-subdued"; hero default "none". */
  background?: SpotBackground | HeroBackground;
  /** Spot: "round" (circle, default) or "fill" (square). Hero: "fill" (square corners, default) or "round" (radius-150 corners). */
  placement?: "round" | "fill";
  /** Spot size in px. Default 72. */
  size?: number;
  /** Anvil artwork name, such as "celebration" (spot) or "anytime" (hero). See Illustration.names. */
  name?: string;
  /** Any image URL, instead of name. */
  src?: string;
  /** Describe the artwork, or leave empty when it's decorative. */
  alt?: string;
  /** Inline artwork, such as an <svg>, instead of src. */
  children?: React.ReactNode;
  /** Placeholder icon shown until artwork is added. */
  icon?: IconName;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Illustration(props: IllustrationProps): React.ReactElement;
export declare namespace Illustration {
  const backgrounds: { spot: SpotBackground[]; hero: HeroBackground[] };
  const names: { spot: string[]; hero: string[] };
  function url(type: "spot" | "hero", name: string): string | undefined;
}
