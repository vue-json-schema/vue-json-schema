import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';

import {
  Dictionary,
  ObjectField,
  ObjectDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  ObjectFieldChild,
  DescriptorConstructor,
  FieldKind
} from '@/types';

export class ObjectParser extends Parser<Dictionary, ObjectDescriptor, ObjectField> {
  protected properties: Dictionary<JsonSchema> = {};

  public get kind(): FieldKind {
    return 'object';
  }

  public get required() {
    return this.schema.required instanceof Array ? this.schema.required : [];
  }

  public get propertiesList() {
    const keys = Object.keys(this.properties);
    const items = this.field.descriptor.order instanceof Array
      ? this.field.descriptor.order
      : keys;

    if (items.length < keys.length) {
      keys.forEach((prop) => {
        if (!items.includes(prop)) {
          items.push(prop);
        }
      });
    }

    return items;
  }

  public get children(): ObjectFieldChild[] {
    return this.propertiesList
      .map((key): ParserOptions<unknown, AbstractUISchemaDescriptor> => ({
        schema: this.properties[key],
        model: this.model.hasOwnProperty(key) ? this.model[key] : this.properties[key].default,
        descriptor: this.getChildDescriptor(key),
        descriptorConstructor: this.getChildDescriptorConstructor(key),
        name: key,
        onChange: (value) => {
          this.model[key] = value;

          this.emit();
        }
      }))
      .map((options) => Parser.get(options, this))
      .filter((parser) => parser instanceof Parser)
      .map((parser: any) => parser.field as ObjectFieldChild);
  }

  protected getChildDescriptor(key: string) {
    const properties = this.field.descriptor.properties;

    return properties
      ? properties[key] instanceof Function
        ? (properties[key] as Function)(properties[key])
        : properties[key]
      : this.options.descriptorConstructor(this.properties[key]);
  }

  protected getChildDescriptorConstructor(key: string): DescriptorConstructor {
    const properties = this.field.descriptor.properties;

    return properties && properties[key] instanceof Function
      ? properties[key] as DescriptorConstructor
      : this.options.descriptorConstructor;
  }

  public parse() {
    if (this.schema.properties) {
      this.properties = this.schema.properties;
    }

    this.field.children = this.children;

    super.parse();

    delete this.field.attrs.input.required;
    delete this.field.attrs.input['aria-required'];

    if (this.isRoot) {
      delete this.field.attrs.input.name;
    }

    this.emit();
  }

  protected parseValue(data: Dictionary): Dictionary {
    return data || {};
  }
}

Parser.register('object', ObjectParser);
