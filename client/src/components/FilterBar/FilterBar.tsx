import type { CardFilters, CardSortOption } from '../../types/card';

type FilterBarProps = {
  filters: CardFilters;
  types: string[];
  rarities: string[];
  colors: string[];
  costs: number[];
  resultCount: number;
  totalCount: number;
  onChange: (nextFilters: CardFilters) => void;
  onReset: () => void;
};

export function FilterBar({
  filters,
  types,
  rarities,
  colors,
  costs,
  resultCount,
  totalCount,
  onChange,
  onReset,
}: FilterBarProps) {
  const update = <Key extends keyof CardFilters>(key: Key, value: CardFilters[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="filter-panel" aria-label="Card browser filters">
      <div className="filter-panel__heading">
        <div>
          <p className="eyebrow">Card library</p>
          <h2>Browse cards</h2>
        </div>
        <p className="result-count">
          Showing <strong>{resultCount}</strong> of {totalCount}
        </p>
      </div>

      <div className="filter-grid">
        <label className="field field--search">
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            placeholder="Name, subtype, or rules text"
            onChange={(event) => update('search', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select value={filters.type} onChange={(event) => update('type', event.target.value)}>
            <option value="">All types</option>
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Rarity</span>
          <select value={filters.rarity} onChange={(event) => update('rarity', event.target.value)}>
            <option value="">All rarities</option>
            {rarities.map((rarity) => (
              <option value={rarity} key={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </label>


        <label className="field">
          <span>Color</span>
          <select
            multiple
            value={filters.color}
            onChange={(event) => {
              const selectedColors = Array.from(event.target.selectedOptions, (option) => option.value);
              update('color', selectedColors);
            }}
          >
            {colors.map((color) => (
              <option value={color} key={color}>
                {color}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Cost</span>
          <select value={filters.cost} onChange={(event) => update('cost', event.target.value === '' ? '' : String(Number(event.target.value)))}>
            <option value="">Any cost</option>
            {costs.map((cost) => (
              <option value={cost} key={cost}>
                {cost}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => update('sort', event.target.value as CardSortOption)}
          >
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="cost-asc">Cost: Low to high</option>
            <option value="cost-desc">Cost: High to low</option>
            <option value="type-asc">Type, then name</option>
          </select>
        </label>

        <button className="secondary-button filter-reset" type="button" onClick={onReset}>
          Reset filters
        </button>
      </div>
    </section>
  );
}
