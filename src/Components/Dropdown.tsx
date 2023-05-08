interface Props {
  title: string;
  value: string;
  data: { key:string; name:string }[];
  onChange: (event: MouseEvent) => void;
}

const Dropdown = ({ title, value, data, onChange }: Props) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
    <label>
    <label for="options" class="form-label">{title}:</label>
      <select
        className="form-select"
        aria-label="Default select"
        value={value}
        onChange={onChange}
      >
        <option id="options" value="">--Please choose a {title}--</option>
        {data.map((element) => (
          <option key={element.key} value={element.key}>
            {element.name}
          </option>
        ))};
      </select>
    </label>
    </div>
  );
};

export default Dropdown;
