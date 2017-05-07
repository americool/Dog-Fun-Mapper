class CreateLocations < ActiveRecord::Migration[5.0]
  def change
    create_table :locations do |t|
      t.string :title
      t.string :category
      t.string :address
      t.float :lat
      t.float :lng
      t.boolean :verified

      t.timestamps
    end
  end
end
