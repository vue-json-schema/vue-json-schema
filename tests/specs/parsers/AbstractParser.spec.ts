import { Component } from 'vue';
import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, StringField, ParserOptions, ObjectDescriptor } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';

class FakeParser extends Parser<string, ScalarDescriptor, StringField> {
  protected parseValue(data: any): string {
    return data;
  }
}

class ObjectFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  public get type(): string {
    return 'object';
  }

  protected parseValue(data: any): any {
    return data || {};
  }
}

class InputFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  public get type(): string {
    return 'text';
  }

  protected parseValue(data: any): string {
    return data;
  }
}

describe('parsers/Parser', () => {
  describe('instance with required options', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('should have right kind', () => {
        expect(parser.kind).toBe('string');
      });

      it('should have an undefined type', () => {
        expect(parser.type).toBeUndefined();
      });

      it('should have provided schema', () => {
        expect(parser.schema).toEqual({ type: 'string' });
      });

      it('should have field property', () => {
        expect(parser.field).toBeDefined();
      });
    });

    describe('parser.field', () => {
      it('field.name should be undefined', () => {
        expect(parser.field.name).toBeUndefined();
      });

      it('field.kind should be equal to parser.kind', () => {
        expect(parser.field.kind).toBe(parser.kind);
      });

      it('field.isRoot should be truthy', () => {
        expect(parser.field.isRoot).toBeTruthy();
      });

      it('field.required should be truthy with scalar root schema', () => {
        expect(parser.field.required).toBeTruthy();
      });

      it('field.defaultValue should be undefined with undefined schema.default', () => {
        expect(parser.field.defaultValue).toBeUndefined();
      });

      it('field.defaultValue should be set to the default schema value', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string', default: 'Hello' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.defaultValue).toBe('Hello');
      });

      it('field.value should be empty', () => {
        expect(parser.field.value).toBe('');
      });

      it('field.value should be set to the default schema value', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string', default: 'Hello' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.value).toBe('Hello');
      });

      it('field.value should be undefined', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.value).toBeUndefined();
      });

      it('field.value should have a worked setter', () => {
        parser.field.setValue('hello');
        expect(parser.field.value).toBe('hello');
      });

      it('field.attrs should be defined', () => {
        expect(parser.field.attrs).toBeDefined();
      });

      it('field.attrs should be have an initial input property', () => {
        expect(Object.keys(parser.field.attrs)).toEqual(['input', 'label', 'description']);
      });

      it('field.attrs.input should be defined with initial properties', () => {
        expect(parser.field.attrs.input).toEqual({
          type: undefined,
          name: undefined
        });
      });

      it('field.attrs.label should be an empty object', () => {
        expect(parser.field.attrs.label).toEqual({});
      });

      it('field.attrs.description should be an empty object', () => {
        expect(parser.field.attrs.description).toEqual({});
      });

      it('field.props should be defined with an empty object', () => {
        expect(parser.field.props).toEqual({});
      });

      it('field.descriptor should be defined', () => {
        expect(parser.field.descriptor).toBeDefined();
      });

      it('field.descriptor should be a String Descriptor', () => {
        expect(parser.field.descriptor.kind).toBe('string');
      });

      it('field.component should be defined', () => {
        expect(parser.field.component).toBeDefined();
      });

      it('field.component should be an InputElement', () => {
        expect((parser.field.component as Component).name).toBe('InputElement');
      });

      it('field.parent should be undefined', () => {
        expect(parser.field.parent).toBeUndefined();
      });
    });

    describe('parser.parse()', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: { type: 'string' },
        model: '',
        descriptorConstructor: NativeDescriptor.get
      };

      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs should be have input, label and description labels', () => {
        expect(Object.keys(parser.field.attrs).sort()).toEqual([
          'input', 'label', 'description'
        ].sort());
      });

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required', 'aria-required'
        ].sort());
      });

      it('field.attrs.input.type should be undefined', () => {
        expect(parser.field.attrs.input.type).toBeUndefined();
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.readonly).toBeFalsy();
      });

      it('field.attrs.input.readonly should be truthy', () => {
        expect(parser.field.attrs.input.required).toBeTruthy();
      });

      it('field.attrs.label should be defined', () => {
        expect(parser.field.attrs.label).toBeDefined();
      });

      it('field.attrs.label.id should be undefined', () => {
        expect(parser.field.attrs.label.id).toBeUndefined();
      });

      it('field.attrs.label.for should be defined', () => {
        expect(parser.field.attrs.label.for).toBeDefined();
      });

      it('field.attrs.label.for should be equal to field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.description.id should be undefined', () => {
        expect(parser.field.attrs.description.id).toBeUndefined();
      });

      it('field.attrs.input.aria-required should be truthy', () => {
        expect(parser.field.attrs.input['aria-required']).toBe('true');
      });
    });
  });

  describe('schema with title', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        title: 'Name'
      },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('should have provided schema', () => {
        expect(parser.schema).toEqual({
          type: 'string',
          title: 'Name'
        });
      });
    });

    describe('parser.parse()', () => {
      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs.label should have properties { id, tabindex }', () => {
        expect(Object.keys(parser.field.attrs.label).sort()).toEqual([
          'for', 'id'
        ].sort());
      });

      it('field.attrs.label.id should be defined', () => {
        expect(parser.field.attrs.label.id).toBeDefined();
      });

      it('field.attrs.label.for should be equal to parser.field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.description should have properties { id }', () => {
        expect(Object.keys(parser.field.attrs.description).sort()).toEqual([
          'id'
        ].sort());
      });

      it('field.attrs.description.id should be undefined', () => {
        expect(parser.field.attrs.description.id).toBeUndefined();
      });
    });
  });

  describe('schema with title and description', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        title: 'Name',
        description: 'Your First Name'
      },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('should have provided schema', () => {
        expect(parser.schema).toEqual({
          type: 'string',
          title: 'Name',
          description: 'Your First Name'
        });
      });
    });

    describe('parser.parse()', () => {
      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required', 'aria-required', 'aria-labelledby'
        ].sort());
      });

      it('field.attrs.label should have properties { id, tabindex }', () => {
        expect(Object.keys(parser.field.attrs.label).sort()).toEqual([
          'for', 'id', 'tabindex'
        ].sort());
      });

      it('field.attrs.label.id should be defined', () => {
        expect(parser.field.attrs.label.id).toBeDefined();
      });

      it('field.attrs.label.for should be equal to parser.field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.label.tabindex should be equal to -1', () => {
        expect(parser.field.attrs.label.tabindex).toBe('-1');
      });

      it('field.attrs.description should have properties { id, tabindex }', () => {
        expect(Object.keys(parser.field.attrs.description).sort()).toEqual([
          'id', 'tabindex'
        ].sort());
      });

      it('field.attrs.description.id should be defined', () => {
        expect(parser.field.attrs.description.id).toBeDefined();
      });

      it('field.attrs.description.tabindex should be equal to -1', () => {
        expect(parser.field.attrs.description.tabindex).toBe('-1');
      });
    });
  });

  describe('with an object schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };

    const parentOptions: ParserOptions<string, ObjectDescriptor> = {
      schema: schema as JsonSchema,
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const childOptions: ParserOptions<string, ScalarDescriptor> = {
      schema: schema.properties.name as JsonSchema,
      name: 'name',
      model: 'Jon Snow',
      descriptorConstructor: NativeDescriptor.get
    };

    const parent = new ObjectFakeParser(parentOptions);
    const parser = new InputFakeParser(childOptions, parent);

    describe('parser properties', () => {
      it('parent should have a defined type', () => {
        expect(parent.type).toBe('object');
      });

      it('child should have a defined type', () => {
        expect(parser.type).toBe('text');
      });
    });

    describe('parser.field', () => {
      it('field.name should be defined', () => {
        expect(parser.field.name).toBe('name');
      });

      it('field.isRoot should be falsy', () => {
        expect(parser.field.isRoot).toBeFalsy();
      });

      it('field.required should be falsy with missing object parent schema.required', () => {
        expect(parser.field.required).toBeFalsy();
      });

      it('field.value should have the default value', () => {
        expect(parser.field.value).toBe('Jon Snow');
      });

      it('field.value should have a worked setter', () => {
        parser.field.setValue('Tyrion Lannister');
        expect(parser.field.value).toBe('Tyrion Lannister');
      });

      it('parent.field.value should update with child\'s setter', () => {
        parser.field.setValue('Arya Stark');
        expect(parent.field.value).toEqual({});
      });

      it('field.attrs.input should be defined with initial properties', () => {
        expect(parser.field.attrs.input).toEqual({
          type: undefined,
          name: 'name'
        });
      });

      it('field.parent should be defined', () => {
        expect(parser.field.parent).toBeDefined();
      });
    });

    describe('parser.parse()', () => {
      const parent = new ObjectFakeParser(parentOptions);
      const parser = new InputFakeParser(childOptions, parent);

      parser.parse();
      parent.parse();

      it('field.attrs should be have input, label and description labels', () => {
        expect(Object.keys(parser.field.attrs).sort()).toEqual([
          'input', 'label', 'description'
        ].sort());
      });

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required'
        ].sort());
      });

      it('field.attrs.input.type should be defined', () => {
        expect(parser.field.attrs.input.type).toBe('text');
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.readonly).toBeFalsy();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.required).toBeFalsy();
      });
    });
  });
});
